import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IWVTMState } from '../store';
import { EDITOR_MODES } from '../shared';

@Injectable()
export class EditorActions {

  static EDITOR_MODE_CHANGE = 'EDITOR_MODE_CHANGE';
  static SIMULATION_START = 'SIMULATION_START';
  static SIMULATE_TASK = 'SIMULATE_TASK';
  static SIMULATION_STOP = 'SIMULATION_STOP';
  static SELECT_TASK = 'SELECT_TASK';
  static DESELECT_TASK = 'DESELECT_TASK';

  constructor(private redux: NgRedux<IWVTMState>) {}

  startNew() {
    console.log('start new project');
  }

  selectTask(taskId: string) {
    this.redux.dispatch({
      type: EditorActions.SELECT_TASK,
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

  startSimulation() {
    const {editorState, taskModel} = this.redux.getState();
    if (editorState.mode === EDITOR_MODES.SIMULATION) {
      return;
    }

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
    if (clickAction === 'start') {
      this.startSimulation();
    } else {
      this.stopSimulation();
    }
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
      type: EditorActions.SIMULATION_STOP,
      payload: {}
    });

    this.redux.dispatch({
      type: EditorActions.EDITOR_MODE_CHANGE,
      payload: {
        mode: EDITOR_MODES.DRAWING
      }
    });
  }
}
