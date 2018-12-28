const htmlRegExp = new RegExp('[&<>"]', 'g');
const attrRegExp = new RegExp('"', 'g')

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

const escapeAttribute = (s) => {
  return s.replace(attrRegExp, '&quot;')
}

const escapeHtml = (s) => {
  return s.replace(htmlRegExp, unsafe)
}

// Utility for writing html elements to a stream.
//
// Use a closure so we don't have to keep passing the stream.
//
// const h = element(stream)
//
// Then write to the stream with the returned closure.
//
const hyper = (stream) => {

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
      tag.forEach((t) => {
        h(t, attrs, children, close)
      })
      return
    }

    // Close a tag
    if (attrs === true) {
      return stream.write(`</${tag}>`)

    // Overloaded attributes
    } else if (typeof(attrs) === 'string' || Array.isArray(attrs)) {
      if (typeof(children) === 'boolean') {
        close = children
      }
      children = attrs
      attrs = null
    }

    // Open a tag
    stream.write(`<${tag}`)

    if (attrs && typeof(attrs) === 'object') {
      for (let k in attrs) {
        stream.write(` ${k}="${escapeAttribute(attrs[k])}"`)
      }
    }

    // Close the opening tag
    stream.write('>')

    // Recurse on child elements
    if (Array.isArray(children)) {
      children.forEach((elem) => {
        const {tag, attrs, children, close} = elem
        h(tag, attrs, children, close)
      })
    // Writing a child text node
    } else if (typeof(children) === 'string') {
      stream.write(escapeHtml(children))
    }

    // Close the tag
    if (close) {
      stream.write(`</${tag}>`)
    }
  }

  h.doctype = (type = 'html') => {
    stream.write(`<!DOCTYPE ${type}>`)
  }

  h.text = (s) => {
    stream.write(escapeHtml(s))
  }

  return h
}

export {hyper, escapeHtml, escapeAttribute}
