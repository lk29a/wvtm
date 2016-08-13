import { List, Map, Record, Seq } from "immutable";
import { EDITOR_MODES } from "../../shared";

export const EditorStateRecord = Record({
  mode: EDITOR_MODES.DRAWING,
  canvasSize: {
    width: 1000,
    height: 1000
  }
})

export type IEditorState = {
  mode: EDITOR_MODES, /* mode of editor */
};
