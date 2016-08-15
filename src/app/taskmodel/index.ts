import {ITask, ITaskModel, ICoord, deimmutifyTaskModel, reimmutifyTaskModel} from "./taskmodel.types";
import {taskModelReducer} from "./taskmodel.reducer";
export * from "./taskmodel.actions";
export * from "./taskmodel.service";


export {
  ITask,
  ITaskModel,
  ICoord,
  taskModelReducer,
  deimmutifyTaskModel,
  reimmutifyTaskModel
}

