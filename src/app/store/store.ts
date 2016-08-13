import { combineReducers } from "redux";
// import {ITaskModel, taskModelReducer} from '../taskmodel';
import * as taskModel from "../taskmodel";
import * as editor from "./editor";


export interface IWVTMState {
  taskModel?: taskModel.ITaskModel,
  editor?: editor.IEditorState
}

export const rootReducer = combineReducers<IWVTMState>({
  taskModel: taskModel.taskModelReducer,
  editor: editor.editorReducer,
  // simulation: simulationReducer,
  // userAction: userActionReducer
});

export function deimmutify(state: IWVTMState): Object {
  return {
    taskModel: taskModel.deimmutifyTaskModel(state.taskModel),
  };
}

export function reimmutify(plain): IWVTMState {
  return plain ? {
    taskModel: taskModel.reimmutifyTaskModel(plain.taskModel),
  } : {};
}

