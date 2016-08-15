declare var require: any
const createLogger = require("redux-logger");
const thunk = require("redux-thunk").default;
import { IWVTMState, rootReducer, deimmutify, reimmutify } from './store';

export {
  IWVTMState,
  rootReducer,
  reimmutify
}

export const middlewares = [
  thunk,
  createLogger({
    level: 'info',
    collapsed: true,
    stateTransformer: deimmutify
  })
];
