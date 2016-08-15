import { combineReducers } from "redux";
// import {ITaskModel, taskModelReducer} from '../taskmodel';
import * as taskModel from "../taskmodel";
import * as editor from "../editor";


export interface IWVTMState {
  taskModel?: taskModel.ITaskModel,
  editorState?: editor.IEditorState
}

export const rootReducer = combineReducers<IWVTMState>({
  taskModel: taskModel.taskModelReducer,
  editorState: editor.editorStateReducer
  // simulation: simulationReducer,
  // userAction: userActionReducer
});

export function deimmutify(state: IWVTMState): Object {
  return {
    taskModel: taskModel.deimmutifyTaskModel(state.taskModel),
    editorState: editor.deimmutifyEditorState(state.editorState),
  };
}

export function reimmutify(plain): IWVTMState {
  return plain ? {
    taskModel: taskModel.reimmutifyTaskModel(plain.taskModel),
  } : {};
}

