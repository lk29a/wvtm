import { Map } from "immutable";
import {TaskModelActions} from "./taskmodel.actions";
import { ITaskModel, ITask } from "./taskmodel.types";
import { INITIAL_STATE } from "./taskmodel.initial-state";
import * as taskModelService from "./taskmodel.service";


function task(state: ITaskModel, action): Map<string, ITask> {
  switch (action.type) {

    case TaskModelActions.UPDATE_TASK:
      if (state.selectedTask) {
        let updatedTask = taskModelService.updateTask(state.tasks.get(state.selectedTask), action.payload.type, action.payload.value);
        return state.tasks.set(state.selectedTask, updatedTask);
      }
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

    case TaskModelActions.REMOVE_TASK:
      return taskModelService.removeTask(state, action.payload.taskId) as ITaskModel;

    case TaskModelActions.NEW_MODULE:
      taskModelService.newModule(state, action.payload.taskId);
      return state;


    case TaskModelActions.ADD_MODULE:
      if (state.selectedTask) {
        return state;
      }
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
    case TaskModelActions.ADD_MODULE:
    case TaskModelActions.NEW_MODULE:
      state = taskModel(state, action);
      if(action.type !== TaskModelActions.NEW_MODULE) {
        state = taskModelService.validateStructure(state);
      }
      return state;

    case TaskModelActions.UPDATE_TASK:
      state = state.set("tasks", task(state, action)) as ITaskModel;
      return taskModelService.validateStructure(state);



    case TaskModelActions.SELECT_TASK:
      let selected = state.selectedTask;
      return state.set("selectedTask", selected === action.payload.taskId ? "" : action.payload.taskId) as ITaskModel;

    default:
      return state;
  }
}
