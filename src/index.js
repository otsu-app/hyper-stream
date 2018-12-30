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
  }
}

const escapeAttribute = (s) => {
  return ('' + s).replace(attrRegExp, '&quot;')
}

const escapeHtml = (s) => {
  return ('' + s).replace(htmlRegExp, unsafe)
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

  function h(tag, attrs, children, close) {

    if (typeof(children) === 'boolean') {
      close = children
    }

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
      children = attrs
      attrs = null
    }

    // Open a tag
    stream.write(`<${tag}`)

    if (typeof(attrs) === 'object' && attrs) {
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
