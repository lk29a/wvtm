import { Injectable } from "@angular/core";
import { NgRedux } from "ng2-redux";
import { IWVTMState } from "../store";

@Injectable()
export class TaskModelActions {

  static ADD_TASK: string = "ADD_TASK";
  static REMOVE_TASK: string = "REMOVE_TASK";
  static UPDATE_TASK: string = "UPDATE_TASK";
  static SELECT_TASK: string = "SELECT_TASK";
  static ADD_MODULE: string = "ADD_MODULE";
  static NEW_MODULE: string = "NEW_MODULE";


  constructor(private redux: NgRedux<IWVTMState>) { }

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
