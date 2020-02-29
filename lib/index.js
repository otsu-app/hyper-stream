"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escapeAttribute = exports.escapeHtml = exports.hyper = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
  return String(s).replace(attrRegExp, '&quot;');
};

exports.escapeAttribute = escapeAttribute;

var escapeHtml = function escapeHtml(s) {
  return String(s).replace(htmlRegExp, unsafe);
}; // Utility for writing html elements to a stream.
//
// Use a closure so we don't have to keep passing the stream.
//
// const h = element(stream)
//
// Then write to the stream with the returned closure.
//


exports.escapeHtml = escapeHtml;

var hyper = function hyper(stream) {
  function h(tag, attrs, children, close) {
    if (typeof children === 'boolean') {
      close = children;
    } // Same operation on multiple tags,
    // useful for closing multiple tags


    if (Array.isArray(tag)) {
      tag.forEach(function (t) {
        h(t, attrs, children, close);
      });
      return;
    } // Close a tag


    if (attrs === true) {
      return stream.write("</".concat(tag, ">")); // Overloaded attributes
    } else if (typeof attrs === 'string' || Array.isArray(attrs)) {
      children = attrs;
      attrs = null;
    } // Open a tag


    stream.write("<".concat(tag));

    if (_typeof(attrs) === 'object' && attrs) {
      for (var k in attrs) {
        if (typeof attrs[k] === 'boolean') {
          if (attrs[k]) {
            stream.write(' ' + k);
          }
        } else {
          stream.write(" ".concat(k, "=\"").concat(escapeAttribute(attrs[k]), "\""));
        }
      }
    } // Close the opening tag


    stream.write('>'); // Recurse on child elements

    if (Array.isArray(children)) {
      children.forEach(function (elem) {
        var tag = elem.tag,
            attrs = elem.attrs,
            children = elem.children,
            close = elem.close;
        h(tag, attrs, children, close);
      }); // Writing a child text node
    } else if (typeof children === 'string') {
      stream.write(escapeHtml(children));
    } // Close the tag


    if (close) {
      stream.write("</".concat(tag, ">"));
    }
  }

  h.doctype = function () {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'html';
    stream.write("<!DOCTYPE ".concat(type, ">"));
  };

  h.text = function (s) {
    stream.write(escapeHtml(s));
  };

  return h;
};

exports.hyper = hyper;
