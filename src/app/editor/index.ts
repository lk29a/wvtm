import {IEditorState, deimmutifyEditorState} from "./editor.types";
import {editorStateReducer} from "./editor.reducer";
export * from "./editor.component";
export * from "./editor.actions";
export * from "./shared";


export {
  IEditorState,
  editorStateReducer,
  deimmutifyEditorState,
}
