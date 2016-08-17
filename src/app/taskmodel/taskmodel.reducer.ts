import { Map } from "immutable";
import {TaskModelActions} from "./taskmodel.actions";
import { ITaskModel, ITask } from "./taskmodel.types";
import { INITIAL_STATE } from "./taskmodel.initial-state";
import * as taskModelService from "./taskmodel.service";


function task(state: Map<string, ITask>, action): Map<string, ITask> {
  switch (action.type) {

    case TaskModelActions.UPDATE_TASK:
      let updatedTask = taskModelService.updateTask(state.get(action.payload.taskId), action.payload.type, action.payload.value);
      return state.set(action.payload.taskId, updatedTask);

    default:
    return state;
  }
}

function taskModel(state: ITaskModel, action): ITaskModel {
  switch (action.type) {
    case TaskModelActions.ADD_TASK:
      if (state.selectedTask) {
        let newTask = taskModelService.createTask(state.selectedTask, action.payload.taskType);
        return taskModelService.addTask(state, newTask) as ITaskModel;
      }
      return state;

   case TaskModelActions.NEW_MODULE:

     taskModelService.newModule(state, action.payload.taskId);
     return state;


   case TaskModelActions.ADD_MODULE:
     if (state.selectedTask) {
       return state;
     }
     return state;

    case TaskModelActions.REMOVE_TASK:
        return taskModelService.removeTask(state, action.payload.taskId) as ITaskModel;

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
    case TaskModelActions.ADD_MODULE:
    case TaskModelActions.NEW_MODULE:
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
