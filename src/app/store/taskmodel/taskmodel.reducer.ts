import {TaskModelActions} from "../../taskmodel";

export function taskModelReducer(state: ITaskModelData = INITIAL_STATE, action): ITaskModelData {
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
  }

}