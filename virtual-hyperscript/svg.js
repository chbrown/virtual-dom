var h = require('./index.js');


var SVGAttributeNamespace = require('./svg-attribute-namespace');

export class AttributeHook {
  type = 'AttributeHook';
  constructor(public namespace, public value) {}

  hook(node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
      prev.value === this.value &&
      prev.namespace === this.namespace) {
      return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
  }

  unhook(node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
      next.namespace === this.namespace) {
      return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.slice(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
  }
}

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

module.exports = svg;

function svg(tagName, properties, children) {
  if (!children && isChildren(properties)) {
    children = properties;
    properties = {};
  }

  properties = properties || {};

  // set namespace for svg
  properties.namespace = SVG_NAMESPACE;

  var attributes = properties.attributes || (properties.attributes = {});

  for (var key in properties) {
    if (!properties.hasOwnProperty(key)) {
      continue;
    }

    var namespace = SVGAttributeNamespace(key);

    if (namespace === undefined) { // not a svg attribute
      continue;
    }

    var value = properties[key];

    if (typeof value !== 'string' &&
      typeof value !== 'number' &&
      typeof value !== 'boolean'
    ) {
      continue;
    }

    if (namespace !== null) { // namespaced attribute
      properties[key] = attributeHook(namespace, value);
      continue;
    }

    attributes[key] = value
    properties[key] = undefined
  }

  return h(tagName, properties, children);
}

function isChildren(x) {
  return typeof x === 'string' || Array.isArray(x);
}
