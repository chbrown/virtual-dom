export function isHook(hook) {
  return hook &&
    (typeof hook.hook === 'function' && !hook.hasOwnProperty('hook') ||
      typeof hook.unhook === 'function' && !hook.hasOwnProperty('unhook'));
}

export function isThunk(t) {
  return t && t.type === 'Thunk';
}

export function isVirtualText(x) {
  return x && x.type === 'VirtualText';
}

export function isVirtualNode(x) {
  return x && x.type === 'VirtualNode' && x.version === version;
}

export function isWidget(w) {
  return w && w.type === 'Widget';
}

export class VirtualText {
  type = 'VirtualText';
  constructor(text) {
    this.text = String(text);
  }
}

// VirtualPatch.NONE = 0;
// VirtualPatch.VTEXT = 1;
// VirtualPatch.VNODE = 2;
// VirtualPatch.WIDGET = 3;
// VirtualPatch.PROPS = 4;
// VirtualPatch.ORDER = 5;
// VirtualPatch.INSERT = 6;
// VirtualPatch.REMOVE = 7;
// VirtualPatch.THUNK = 8;

export class VirtualPatch {
  type = 'VirtualPatch';
  constructor(type, vNode, patch) {
    this.type = Number(type);
    this.vNode = vNode;
    this.patch = patch;
  }
}

export function handleThunk(a, b) {
  var renderedA = a;
  var renderedB = b;

  if (isThunk(b)) {
    renderedB = renderThunk(b, a);
  }

  if (isThunk(a)) {
    renderedA = renderThunk(a, null);
  }

  return {
    a: renderedA,
    b: renderedB
  };
}

function renderThunk(thunk, previous) {
  var renderedThunk = thunk.vnode;

  if (!renderedThunk) {
    renderedThunk = thunk.vnode = thunk.render(previous);
  }

  if (!(isVNode(renderedThunk) ||
      isVText(renderedThunk) ||
      isWidget(renderedThunk))) {
    throw new Error('thunk did not return a valid node');
  }

  return renderedThunk;
}

export function VirtualNode(tagName, properties, children, key, namespace) {
  this.tagName = tagName;
  this.properties = properties || {};
  this.children = children || [];
  this.key = key !== null ? String(key) : undefined;
  this.namespace = (typeof namespace === 'string') ? namespace : null;

  var count = (children && children.length) || 0;
  var descendants = 0;
  var hasWidgets = false;
  var hasThunks = false;
  var descendantHooks = false;
  var hooks;

  for (var propName in properties) {
    if (properties.hasOwnProperty(propName)) {
      var property = properties[propName];
      if (isVHook(property) && property.unhook) {
        if (!hooks) {
          hooks = {};
        }

        hooks[propName] = property;
      }
    }
  }

  for (var i = 0; i < count; i++) {
    var child = children[i];
    if (isVNode(child)) {
      descendants += child.count || 0;

      if (!hasWidgets && child.hasWidgets) {
        hasWidgets = true;
      }

      if (!hasThunks && child.hasThunks) {
        hasThunks = true;
      }

      if (!descendantHooks && (child.hooks || child.descendantHooks)) {
        descendantHooks = true;
      }
    }
    else if (!hasWidgets && isWidget(child)) {
      if (typeof child.destroy === 'function') {
        hasWidgets = true;
      }
    }
    else if (!hasThunks && isThunk(child)) {
      hasThunks = true;
    }
  }

  this.count = count + descendants;
  this.hasWidgets = hasWidgets;
  this.hasThunks = hasThunks;
  this.hooks = hooks;
  this.descendantHooks = descendantHooks;
}

VirtualNode.prototype.type = 'VirtualNode';
