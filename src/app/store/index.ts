declare var require: any
const createLogger = require("redux-logger");
const thunk = require("redux-thunk");
import { IWVTMState, rootReducer } from './store';
import {IEditorState} from "./editor";


export {
  IWVTMState,
  rootReducer,
  IEditorState
}

export const middlewares = [
  thunk,
  createLogger({
    level: 'info',
    collapsed: true,
  })
];

