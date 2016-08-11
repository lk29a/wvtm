import { Injectable } from "@angular/core";
import { NgRedux } from "ng2-redux";
import { IWVTMState } from "../store";
import { EDITOR_MODES } from "../shared";

@Injectable()
export class EditorActions {

  static EDITOR_MODE_CHANGE: string = "EDITOR_MODE_CHANGE";

  constructor(private redux: NgRedux<IWVTMState>) {}

  startSimulationMode() {
    this.redux.dispatch({
      type: EditorActions.EDITOR_MODE_CHANGE,
      data: {
        mode: EDITOR_MODES.SIMULATION
      }
    });
  }

  stopSimulationMode() {
    this.redux.dispatch({
      type: EditorActions.EDITOR_MODE_CHANGE,
      data: {
        mode: EDITOR_MODES.DRAWING
      }
    });
  }
}
