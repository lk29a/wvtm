import {combineReducers} from "redux";
import {ITaskModelData, taskModelReducer} from "./taskmodel.reducer";


export interface IWVTMState {
  taskModel: ITaskModelData
}

export const rootReducer = combineReducers<IWVTMState>({
  taskModel: taskModelReducer
  // simulation: simulationReducer,
  // userAction: userActionReducer
});
