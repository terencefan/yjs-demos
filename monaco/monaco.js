/* eslint-env browser */

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import * as monaco from 'monaco-editor'

// @ts-ignore
window.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return '/monaco/dist/json.worker.bundle.js'
    }
    if (label === 'css') {
      return '/monaco/dist/css.worker.bundle.js'
    }
    if (label === 'html') {
      return '/monaco/dist/html.worker.bundle.js'
    }
    if (label === 'typescript' || label === 'javascript') {
      return '/monaco/dist/ts.worker.bundle.js'
    }
    return '/monaco/dist/editor.worker.bundle.js'
  }
}

const APP_SERVER_HOST = "https://2115-2404-f801-9000-18-950c-5204-5de0-f626.ngrok.io";

window.addEventListener('load', async () => {

  let url = `${APP_SERVER_HOST}/negotiate?id=default`;
  let res = await fetch(url);
  let data = await res.json();
  console.log(data)

  const ydoc = new Y.Doc()
  const ytext = ydoc.getText('monaco')

  const provider = new WebsocketProvider(data.url, '', ydoc)
  // const provider = new WebsocketProvider('ws://localhost:1235', 'monaco-demo', ydoc)

  const editor = monaco.editor.create(/** @type {HTMLElement} */ (document.getElementById('monaco-editor')), {
    value: '',
    language: 'javascript',
    theme: 'vs-dark'
  })
  const monacoBinding = new MonacoBinding(ytext, /** @type {monaco.editor.ITextModel} */ (editor.getModel()), new Set([editor]), provider.awareness)

  const connectBtn = /** @type {HTMLElement} */ (document.getElementById('y-connect-btn'))
  connectBtn.addEventListener('click', () => {
    if (provider.shouldConnect) {
      provider.disconnect()
      connectBtn.textContent = 'Connect'
    } else {
      provider.connect()
      connectBtn.textContent = 'Disconnect'
    }
  })

  // @ts-ignore
  window.example = { provider, ydoc, ytext, monacoBinding }
})
