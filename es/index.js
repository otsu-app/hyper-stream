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
    default:
      return s;
  }
}

var escapeAttribute = function escapeAttribute(s) {
  return s.replace(attrRegExp, '&quot;');
};

var escapeHtml = function escapeHtml(s) {
  return s.replace(htmlRegExp, unsafe);
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

  /**
   *  Write a doctype:
   *
   *  h.doctype()
   *
   *  Start an element:
   *
   *  h('html')
   *
   *  Close an element:
   *
   *  h('body', true)
   *
   *  Write some text content:
   *
   *  h.text('Hello')
   *
   *  With attributes:
   *
   *  h('meta', {charset: 'utf-8'})
   *
   *  With child text node and closing tag:
   *
   *  h('h3', 'Error', true)
   *
   *  With attributes, child text node and closing tag:
   *
   *  h('a', {href:'#'}, 'text', true)
   *
   *  With child elements:
   *
   *  h('pre', [
   *    {
   *      tag: 'code',
   *      children: stack.toString(),
   *      close: true
   *    }
   *  ], true)
   *
   *  With child elements and attributes:
   *
   *  h('pre', {class: 'stack'}, [
   *    {
   *      tag: 'code',
   *      attrs: {class: 'error'},
   *      children: stack.toString(),
   *      close: true
   *    }
   *  ], true)
   */
  function h(tag, attrs, children, close) {

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
      if (typeof children === 'boolean') {
        close = children;
      }
      children = attrs;
      attrs = null;
    }

    // Open a tag
    stream.write('<' + tag);

    if (attrs && (typeof attrs === 'undefined' ? 'undefined' : (0, _typeof3.default)(attrs)) === 'object') {
      for (var k in attrs) {
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