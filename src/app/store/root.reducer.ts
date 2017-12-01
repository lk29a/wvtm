import { combineReducers } from 'redux';

import * as taskModel from "../taskmodel";
import * as editor from "../editor";
import { IWVTMState } from './root.types';


export const rootReducer = combineReducers<IWVTMState>({
  taskModel: taskModel.taskModelReducer,
  editorState: editor.editorStateReducer,
  lastAction: function lastAction(state = null, action) {
    return action;
  }

  // simulation: simulationReducer,
  // userAction: userActionReducer
});



// export const rootReducer = composeReducers(
//   defaultFormReducer(),
//   combineReducers({
//     elephants: createAnimalReducer(ANIMAL_TYPES.ELEPHANT),
//     lions: createAnimalReducer(ANIMAL_TYPES.LION),
//     router: routerReducer,
// }));
