import { combineReducers } from 'redux';
import {ITaskModel, taskModelReducer} from '../taskmodel';
import * as editor from './editor';


export interface IWVTMState {
  taskModel?: ITaskModel,
  editor?: editor.IEditorState
}

export const rootReducer = combineReducers<IWVTMState>({
  taskModel: taskModelReducer,
  editor: editor.editorReducer,
  // simulation: simulationReducer,
  // userAction: userActionReducer
});
