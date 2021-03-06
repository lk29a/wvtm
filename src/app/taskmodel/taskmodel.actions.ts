import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IWVTMState } from '../store';

@Injectable()
export class TaskModelActions {

  static ADD_TASK = 'ADD_TASK';
  static REMOVE_TASK = 'REMOVE_TASK';
  static UPDATE_TASK = 'UPDATE_TASK';
  static SELECT_TASK = 'SELECT_TASK';
  static DESELECT_TASK = 'DESELECT_TASK';
  static ADD_MODULE = 'ADD_MODULE';
  static NEW_MODULE = 'NEW_MODULE';
  static VALIDATE_MODEL = 'VALIDATE_MODEL';
  static START_NEW = 'START_NEW';

  constructor(private redux: NgRedux<IWVTMState>) { }

  startNew() {
    this.redux.dispatch({
      type: TaskModelActions.START_NEW,
      payload: {}
    });
  }


  addTask(type: string) {
    this.redux.dispatch({
      type: TaskModelActions.ADD_TASK,
      payload: {
        taskType: type
      }
    });
  }

  newModule(taskId: string) {
    this.redux.dispatch({
      type: TaskModelActions.NEW_MODULE,
      payload: {
        taskId: taskId
      }
    });
  }

  addModule(moduleId: string) {
    this.redux.dispatch({
      type: TaskModelActions.ADD_MODULE,
      payload: {
        moduleId: moduleId
      }
    });
  }

  selectTask(taskId: string) {
    this.redux.dispatch({
      type: TaskModelActions.SELECT_TASK,
      payload: {
        taskId: taskId
      }
    });
  }

  removeTask(taskId) {
    this.redux.dispatch({
      type: TaskModelActions.REMOVE_TASK,
      payload: {
        taskId: taskId
      }
    });
  }

  updateTask(type, value) {
    this.redux.dispatch({
      type: TaskModelActions.UPDATE_TASK,
      payload: {
        type: type,
        value: value
      }
    });
  }
}
