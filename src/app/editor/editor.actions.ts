import { Injectable } from "@angular/core";
import { NgRedux } from "ng2-redux";
import { IWVTMState } from "../store";
import { EDITOR_MODES } from "../shared";

@Injectable()
export class EditorActions {

  static EDITOR_MODE_CHANGE: string = "EDITOR_MODE_CHANGE";
  static SIMULATION_START: string = "SIMULATION_START";
  static SIMULATE_TASK: string = "SIMULATE_TASK";
  static SIMULATION_STOP: string = "SIMULATION_STOP";

  constructor(private redux: NgRedux<IWVTMState>) {}

  showValidationInfo() {
    this.redux.dispatch({
      type: EditorActions.EDITOR_MODE_CHANGE,
      payload: {
        mode: EDITOR_MODES.SIMULATION
      }
    });
  }

  startSimulation() {
    let {editorState, taskModel} = this.redux.getState();
    if(editorState.mode === EDITOR_MODES.SIMULATION)
      return;

    this.redux.dispatch({
      type: EditorActions.EDITOR_MODE_CHANGE,
      payload: {
        mode: EDITOR_MODES.SIMULATION
      }
    });

    this.redux.dispatch({
      type: EditorActions.SIMULATION_START,
      payload: {
        taskModel: taskModel
      }
    });


  }


  simulateModel(clickAction) {
    if(clickAction === "start")
      this.startSimulation();
    else
      this.stopSimulation();
  }

  simExecuteTask(task) {
    this.redux.dispatch({
      type: EditorActions.SIMULATE_TASK,
      payload: {
        task: task
      }
    });
  }

  stopSimulation() {
    this.redux.dispatch({
      type: EditorActions.EDITOR_MODE_CHANGE,
      payload: {
        mode: EDITOR_MODES.DRAWING
      }
    });

    this.redux.dispatch({
      type: EditorActions.SIMULATION_STOP,
      payload: {}
    });
  }
}
