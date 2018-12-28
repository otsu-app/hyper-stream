import test from 'ava'
import {hyper} from '../../src/index'

test('should write HTML document', async t => {
  const stream = process.stdout
  const h = hyper(stream)
  h.doctype()
  h('html')
  h('head')
  h('meta', {charset: 'utf-8'})
  h('head', true)

  h('body')

  h('h3', 'Hyper Stream', true)

  h(['body', 'html'], true)
  t.pass()
})

