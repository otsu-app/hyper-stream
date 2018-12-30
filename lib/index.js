'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escapeAttribute = exports.escapeHtml = exports.hyper = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var htmlRegExp = new RegExp('[&<>"]', 'g');
var attrRegExp = new RegExp('"', 'g');

function unsafe(s) {
  switch (s) {
    case '&':
      return '&amp;';
    case '<':
      return '&lt;';
    case '>':
      return '&gt;';
    case '"':
      return '&quot;';
  }
}

var escapeAttribute = function escapeAttribute(s) {
  return ('' + s).replace(attrRegExp, '&quot;');
};

var escapeHtml = function escapeHtml(s) {
  return ('' + s).replace(htmlRegExp, unsafe);
};

// Utility for writing html elements to a stream.
//
// Use a closure so we don't have to keep passing the stream.
//
// const h = element(stream)
//
// Then write to the stream with the returned closure.
//
var hyper = function hyper(stream) {

  function h(tag, attrs, children, close) {

    if (typeof children === 'boolean') {
      close = children;
    }

    // Same operation on multiple tags,
    // useful for closing multiple tags
    if (Array.isArray(tag)) {
      tag.forEach(function (t) {
        h(t, attrs, children, close);
      });
      return;
    }

    // Close a tag
    if (attrs === true) {
      return stream.write('</' + tag + '>');

      // Overloaded attributes
    } else if (typeof attrs === 'string' || Array.isArray(attrs)) {
      children = attrs;
      attrs = null;
    }

    // Open a tag
    stream.write('<' + tag);

    if ((typeof attrs === 'undefined' ? 'undefined' : (0, _typeof3.default)(attrs)) === 'object' && attrs) {
      for (var k in attrs) {
        if (typeof attrs[k] === 'boolean' && attrs[k]) {
          stream.write(' ' + k);
          continue;
        }
        stream.write(' ' + k + '="' + escapeAttribute(attrs[k]) + '"');
      }
    }

    // Close the opening tag
    stream.write('>');

    // Recurse on child elements
    if (Array.isArray(children)) {
      children.forEach(function (elem) {
        var tag = elem.tag,
            attrs = elem.attrs,
            children = elem.children,
            close = elem.close;

        h(tag, attrs, children, close);
      });
      // Writing a child text node
    } else if (typeof children === 'string') {
      stream.write(escapeHtml(children));
    }

    // Close the tag
    if (close) {
      stream.write('</' + tag + '>');
    }
  }

  h.doctype = function () {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'html';

    stream.write('<!DOCTYPE ' + type + '>');
  };

  h.text = function (s) {
    stream.write(escapeHtml(s));
  };

  return h;
};

exports.hyper = hyper;
exports.escapeHtml = escapeHtml;
exports.escapeAttribute = escapeAttribute;