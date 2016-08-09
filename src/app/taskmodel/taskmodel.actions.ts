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
      this.treeLayout.calculate(this._tm.root, 500)
      // save it in flat map
      this.taskMap = this.taskMap.set(task.id, task);
    } catch (ex) {
      this.logger.error(ex);
    }


    this.redux.dispatch({
      type: TaskModelActions.TASK_ADDED,
      data: {

      }
    });
  }

  selectTask() {
    this.redux.dispatch({
      type: TaskModelActions.SELECT_TASK,
      data: {

      }
    });
  }

  removeTask() {
    this.redux.dispatch({
      type: TaskModelActions.REMOVE_TASK,
      data: {

      }
    });
  }

  updateTask() {
    this.redux.dispatch({
      type: TaskModelActions.UPDATE_TASK,
      data: {

      }
    });
  }
}
