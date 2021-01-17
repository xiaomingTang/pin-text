import {
  createStore, combineReducers, applyMiddleware,
} from "redux"
import thunk, { ThunkAction, ThunkDispatch } from "redux-thunk"
// import logger from "redux-logger"

import {
  initState as userInitState,
  reducer as userReducer,
  Action as UserAction,
} from "./user"

const initState = {
  user: userInitState,
}
export type State = typeof initState

const reducer = combineReducers({
  user: userReducer,
})

const store = createStore(reducer, initState, applyMiddleware(
  thunk,
  // logger,
))

export type SyncAction = UserAction

export type AsyncAction<R> = ThunkAction<Promise<R>, State, null, SyncAction>

export type MixedDispatch = ThunkDispatch<State, null, SyncAction>

export default store
