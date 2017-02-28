declare var require: any
import { IWVTMState, rootReducer, deimmutify, reimmutify } from './store';
import { EDITOR_MODES } from "../shared";
import * as createLogger from 'redux-logger';

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
