import { combineReducers } from "redux";
import * as taskModel from "../taskmodel";
import * as editor from "../editor";


export interface IWVTMState {
  taskModel?: taskModel.ITaskModel;
  editorState?: editor.IEditorState;
  lastAction?: string;
}

export const rootReducer = combineReducers<IWVTMState>({
  taskModel: taskModel.taskModelReducer,
  editorState: editor.editorStateReducer,
  lastAction: function lastAction(state = null, action) {
    return action;
  }
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

