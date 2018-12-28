## Hyper Stream

Zero dependency, lightweight library for writing HTML markup to a stream.

### Install

```
yarn add otsu-app/hyper-stream
```

Note you must install from github as npm says that the package name is too similar to another however when I try to publish as `@tmpfs/hyper-stream` apparently I must sign up for private packages, thanks npm for the dark pattern now I will only publish my packages via git repositories.

### Usage

```javascript
import {hyper} from 'hyper-stream'
const h = hyper(process.stdout)
```

Write a doctype:

```javascript
h.doctype()
```

Start an element:

```javascript
h('html')
```

Close an element:

```javascript
h('body', true)
```

Close multiple elements:

```javascript
h(['body', 'html'], true)
```

Write some text content:

```javascript
h.text('Hello')
```

With attributes:

```javascript
h('meta', {charset: 'utf-8'})
```

With child text node and closing tag:

```javascript
h('h3', 'Error', true)
```

With attributes, child text node and closing tag:

```javascript
h('a', {href:'#'}, 'link', true)
```

With child elements:

```javascript
h('pre', [
 {
   tag: 'code',
   children: stack.toString(),
   close: true
 }
], true)
```

With child elements and attributes:

```javascript
h('pre', {class: 'stack'}, [
 {
   tag: 'code',
   attrs: {class: 'error'},
   children: stack.toString(),
   close: true
 }
], true)
```
