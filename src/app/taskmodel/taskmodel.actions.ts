import { Injectable } from "@angular/core";
import { NgRedux } from "ng2-redux";
import { IWVTMState } from "../store";
import { TaskModel } from "./taskmodel";

@Injectable()
export class TaskModelActions {

  static TASK_ADDED: string = "TASK_ADDED";
  static TASK_REMOVED: string = "TASK_REMOVED";
  static TASK_UPDATED: string = "TASK_UPDATED";
  static TASK_SELECTED: string = "TASK_SELECTED";

  constructor(private taskModel: TaskModel,
    private redux: NgRedux<IWVTMState>) {}

  addTask(type: string, parentId: string) {
    try {
      // add the task to tree
      let task = this.taskModel.addTask({ parentTaskId: parentId, taskType: type });
      // calculate layout again
      // this.treeLayout.calculate(this._tm.root, 500)
    } catch (ex) {
      console.log(ex);
    }


    this.redux.dispatch({
      type: TaskModelActions.TASK_ADDED,
      data: {

      }
    });
  }

  selectTask() {
    this.redux.dispatch({
      type: TaskModelActions.TASK_SELECTED,
      data: {

      }
    });
  }

  removeTask() {
    this.redux.dispatch({
      type: TaskModelActions.TASK_REMOVED,
      data: {

      }
    });
  }

  updateTask() {
    this.redux.dispatch({
      type: TaskModelActions.TASK_UPDATED,
      data: {

      }
    });
  }
}
