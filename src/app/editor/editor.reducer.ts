import {EditorActions} from "./editor.actions";
import { IEditorState } from "./editor.types";
import { INITIAL_STATE } from "./editor.initial-state";

export function editorStateReducer(state: IEditorState = INITIAL_STATE, action): IEditorState {
  if (!action.type || !action.payload) {
    return state;
  }

  switch (action.type) {
    case EditorActions.EDITOR_MODE_CHANGE:
      return state;

    default:
      return state;
  }

}
