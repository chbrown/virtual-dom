var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

export function parseTag(tag, props) {
  if (!tag) {
    return 'DIV';
  }

  var noId = !(props.hasOwnProperty('id'));

  var tagParts = split(tag, classIdSplit);
  var tagName = null;

  if (notClassId.test(tagParts[1])) {
    tagName = 'DIV';
  }

  var classes, part, type, i;

  for (i = 0; i < tagParts.length; i++) {
    part = tagParts[i];

    if (!part) {
      continue;
    }

    type = part.charAt(0);

    if (!tagName) {
      tagName = part;
    }
    else if (type === '.') {
      classes = classes || [];
      classes.push(part.slice(1));
    }
    else if (type === '#' && noId) {
      props.id = part.slice(1);
    }
  }

  if (classes) {
    if (props.className) {
      classes.push(props.className);
    }

    props.className = classes.join(' ');
  }

  return props.namespace ? tagName : tagName.toUpperCase();
}
