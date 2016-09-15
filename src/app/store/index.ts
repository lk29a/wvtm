declare var require: any
import { IWVTMState, rootReducer, deimmutify, reimmutify } from './store';
import { EDITOR_MODES } from "../shared";
const createLogger = require("redux-logger");

export {
  IWVTMState,
  rootReducer,
  reimmutify
}

export const middlewares = [
  createLogger({
    level: 'info',
    collapsed: true,
    stateTransformer: deimmutify
  })
];
