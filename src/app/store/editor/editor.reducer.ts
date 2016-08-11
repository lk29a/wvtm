import {EditorActions} from "../../editor";
import { IEditorState } from "./editor.types";
import { INITIAL_STATE } from "./editor.initial-state";

export function editorReducer(state: IEditorState = INITIAL_STATE, action): IEditorState {
  if (!action.type || !action.payload) {
    return state;
  }
  return state;

  // switch (action.type) {
  //   case TaskModelActions.ADD_TASK:
  //   break;
  //     // return state.ma

  //   case TaskModelActions.REMOVE_TASK:
  //     break;

  //   case TaskModelActions.UPDATE_TASK:
  //     break;

  //   case TaskModelActions.SELECT_TASK:
  //     break;

  //   default:
  //     // code...
  //     break;
  // }

}