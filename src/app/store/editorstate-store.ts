import {Injectable} from "@angular/core";
import {Observable, BehaviorSubject} from "rxjs/Rx";
import {EditorState, initialEditorState} from "../editor/shared";
import {EDITOR_MODES} from "../shared";


@Injectable()
export class EditorStateStore {
  private _editorState: BehaviorSubject<EditorState> = new BehaviorSubject(initialEditorState);

  get editorState() {
    return new Observable(fn => this._editorState.subscribe(fn));
  }

  /**
   * set selected task in editor state
   * @param {string} taskId [description]
   */
  setSelectedTask(taskId: string) {
    let state = this._editorState.getValue();
    // emit new state obj
    this._editorState.next(new EditorState(state.mode, taskId));
  }

  /**
   * de-select tasks if any and switch mode
   * @param {EDITOR_MODES} mode [description]
   */
  changeEditorMode(mode: EDITOR_MODES) {
    // emit new state
    this._editorState.next(new EditorState(mode, null));
    // @lk maybe change selected task in taskStore?
  }

}
