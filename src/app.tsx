
import * as React from 'react'
import * as ReactDOM from 'react-dom'

ReactDOM.render(
  <div>Node version: {process.versions.node}</div>,
  document.getElementsByTagName('body')[0])