import { Map } from "immutable";
import {TaskModelActions} from "./taskmodel.actions";
import { ITaskModel, ITask } from "./taskmodel.types";
import { INITIAL_STATE } from "./taskmodel.initial-state";
import * as taskModelService from "./taskmodel.service";


function task(state: Map<string, ITask>, action): Map<string, ITask> {
  return state;
}

function taskModel(state: ITaskModel, action): ITaskModel {
  switch (action.type) {
    case TaskModelActions.ADD_TASK:
    let selectedTask = state.selectedTask;
    if (selectedTask) {
      let task = taskModelService.createTask(state.selectedTask, action.payload.taskType);
      return taskModelService.addTask(state, task) as ITaskModel;
    } else {
      return state;
    }

    case TaskModelActions.REMOVE_TASK:
    case TaskModelActions.UPDATE_TASK:
      return state;

    default:
      return state;
  }
}


export function taskModelReducer(state: ITaskModel = INITIAL_STATE, action): ITaskModel {
  if (!action.type || !action.payload) {
    return state;
  }

  switch (action.type) {
    case TaskModelActions.ADD_TASK:
    case TaskModelActions.REMOVE_TASK:
      return taskModel(state, action);

    case TaskModelActions.UPDATE_TASK:
      return state.set("tasks", task(state.tasks, action)) as ITaskModel;

    case TaskModelActions.SELECT_TASK:
      let selected = state.selectedTask;
      return state.set("selectedTask", selected === action.payload.taskId ? "" : action.payload.taskId) as ITaskModel;

    default:
      return state;
  }
}
