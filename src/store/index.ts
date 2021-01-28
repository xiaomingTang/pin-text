import {
  createStore, combineReducers, applyMiddleware,
} from "redux"
import thunk, { ThunkAction, ThunkDispatch } from "redux-thunk"
// import logger from "redux-logger"

import {
  initState as shortcutEditorInitState,
  reducer as shortcutEditorReducer,
  Action as shortcutEditorAction,
} from "./shortcutEditor"

const initState = {
  shortcutEditor: shortcutEditorInitState,
}
export type State = typeof initState

const reducer = combineReducers({
  shortcutEditor: shortcutEditorReducer,
})

const store = createStore(reducer, initState, applyMiddleware(
  thunk,
  // logger,
))

export type SyncAction = shortcutEditorAction

export type AsyncAction<R> = ThunkAction<Promise<R>, State, null, SyncAction>

export type MixedDispatch = ThunkDispatch<State, null, SyncAction>

export default store
