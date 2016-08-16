import { Injectable } from "@angular/core";
import { NgRedux } from "ng2-redux";
import { IWVTMState } from "../store";

@Injectable()
export class TaskModelActions {

  static ADD_TASK: string = "ADD_TASK";
  static REMOVE_TASK: string = "REMOVE_TASK";
  static UPDATE_TASK: string = "UPDATE_TASK";
  static SELECT_TASK: string = "SELECT_TASK";

  constructor(private redux: NgRedux<IWVTMState>) { }

  addTask(type: string) {
    this.redux.dispatch({
      type: TaskModelActions.ADD_TASK,
      payload: {
        taskType: type
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

  updateTask(taskId, type, value) {
    this.redux.dispatch({
      type: TaskModelActions.UPDATE_TASK,
      payload: {
        taskId: taskId,
        type: type,
        value: value
      }
    });
  }
}
