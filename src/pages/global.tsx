import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { message } from "antd"

import { ErrorBoundary, ErrorFallback } from "@Src/components/ErrorHandler"

import store from "@Src/store/index"
import "@Src/polyfills/index"

import "./global.less"

message.config({
  maxCount: 3,
})

export function render(comp: JSX.Element) {
  ReactDOM.render(
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
    >
      <Provider store={store}>
        {comp}
      </Provider>
    </ErrorBoundary>,
    document.querySelector("#app"),
  )
}
