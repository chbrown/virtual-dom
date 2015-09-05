var EvStore = require('ev-store');

export class EvHook {
  contructor(value) {
    this.value = value;
  }
  hook(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.slice(3);

    es[propName] = this.value;
  }
  unhook(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.slice(3);

    es[propName] = undefined;
  }
}

var document = require('global/document');
var nextTick = require('next-tick');

module.exports = MutableFocusHook;

export class MutableFocusHook
  constructor() { }

  hookfunction(node) {
    nextTick(function() {
      if (document.activeElement !== node) {
        node.focus();
      }
    });
  }
}

export class SoftSetHook {
  constructor(value) { }
    this.value = value;
  }
  hook(node, propertyName) {
    if (node[propertyName] !== this.value) {
      node[propertyName] = this.value;
    }
  }
}
