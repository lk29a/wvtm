import * as taskModel from "../taskmodel";
import * as editor from "../editor";


export interface IWVTMState {
  taskModel?: taskModel.ITaskModel,
  editorState?: editor.IEditorState
}
