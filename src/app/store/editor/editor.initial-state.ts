import { IEditorState } from "./editor.types";
import { EDITOR_MODES } from "../../shared";

export const INITIAL_STATE: IEditorState = {
  mode: EDITOR_MODES.DRAWING
};
