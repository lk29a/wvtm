import { combineReducers } from 'redux';
import * as taskmodel from './taskmodel';


export interface IWVTMState {
  taskModel?: taskmodel.ITaskModel
}

export const rootReducer = combineReducers<IWVTMState>({
  taskModel: taskmodel.taskModelReducer
  // simulation: simulationReducer,
  // userAction: userActionReducer
});
