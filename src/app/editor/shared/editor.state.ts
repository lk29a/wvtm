import {EDITOR_MODES} from "../../shared";

export class EditorState {

  constructor(public mode: EDITOR_MODES, public selectedTask: string) {
  }
}

export const initialEditorState = new EditorState(EDITOR_MODES.DRAWING, null);
