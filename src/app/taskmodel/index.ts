import {ITask, ITaskModel} from "./taskmodel.types";
import {taskModelReducer} from "./taskmodel.reducer";

export * from "./taskmodel.actions";
export * from "./taskmodel.thunk";
export * from "./taskmodel.service";


export {
  ITask,
  ITaskModel,
  taskModelReducer
}

