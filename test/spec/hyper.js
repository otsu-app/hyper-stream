import test from 'ava'
import {hyper} from '../../src/index'
import pkg from '../../package.json'

test('should use custom doctype', async t => {
  const stream = process.stdout
  const h = hyper(stream)
  h.doctype('html')
  t.pass()
})

// Yeh i know there are no assertions, trust me
// it works ;)
test('should write HTML document', async t => {
  const stream = process.stdout
  const h = hyper(stream)
  h.doctype()
  h('html')
  h('head')
  h('meta', {charset: 'utf-8'})
  h('head', true)

  h('body')

  h('h3', '< Hyper & Stream >', true)

  h('a', {href:'https://github.com/otsu-app/hyper-stream'}, 'Repository', true)

  h('p')
  h.text(pkg.description)
  h('p', true)
  h('pre', {class: 'code'}, [
     {
       tag: 'code',
       attrs: {class: 'javascript'},
       children: "import {hyper} from 'hyper-stream'",
       close: true
     }
   ], true)

  h('span', pkg.name, true)
  h('span', '"' + pkg.version + '"')

  h('div', {class: 'grow'}, true)

  h(['body', 'html'], true)
  t.pass()
})
