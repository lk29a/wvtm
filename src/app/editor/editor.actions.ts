import { Injectable } from "@angular/core";
import { NgRedux } from "ng2-redux";
import { IWVTMState } from "../store";
import { EDITOR_MODES } from "../shared";

@Injectable()
export class EditorActions {

  static EDITOR_MODE_CHANGE: string = "EDITOR_MODE_CHANGE";
  static ADD_TO_LIBRARY: string = "ADD_TO_LIBRARY";

  constructor(private redux: NgRedux<IWVTMState>) {}

  addToLibrary(taskId: string) {
    this.redux.dispatch({
      type: EditorActions.ADD_TO_LIBRARY,
      payload: {
        taskId: taskId
      }
    });
  }

  showValidationInfo() {
    this.redux.dispatch({
      type: EditorActions.EDITOR_MODE_CHANGE,
      payload: {
        mode: EDITOR_MODES.SIMULATION
      }
    });
  }

  startSimulationMode() {
    this.redux.dispatch({
      type: EditorActions.EDITOR_MODE_CHANGE,
      payload: {
        mode: EDITOR_MODES.SIMULATION
      }
    });
  }

  stopSimulationMode() {
    this.redux.dispatch({
      type: EditorActions.EDITOR_MODE_CHANGE,
      payload: {
        mode: EDITOR_MODES.DRAWING
      }
    });
  }
}
