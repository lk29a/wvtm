import {TaskModelActions} from "../../taskmodel";
import { ITaskModel } from "./taskmodel.types";
import { INITIAL_STATE } from "./taskmodel.initial-state";

export function taskModelReducer(state: ITaskModel = INITIAL_STATE, action): ITaskModel {
  console.log(state);
  console.log(action);

  if (!action.type || !action.payload) {
    return state;
  }
  return state;

  // switch (action.type) {
  //   case TaskModelActions.ADD_TASK:
  //   break;
  //     // return state.ma

  //   case TaskModelActions.REMOVE_TASK:
  //     break;

  //   case TaskModelActions.UPDATE_TASK:
  //     break;

  //   case TaskModelActions.SELECT_TASK:
  //     break;

  //   default:
  //     // code...
  //     break;
  // }

}