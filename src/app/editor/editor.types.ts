import { List, Map, Record} from 'immutable';
import { EDITOR_MODES } from '../shared';
import {ITask} from "../taskmodel/taskmodel.types";

export const EditorStateRecord = Record({
  mode: EDITOR_MODES.DRAWING,
  canvasSize: {
    width: 1000,
    height: 1000
  },
  selectedTask: undefined,
  statusData: Map<string, any>(),
  simulation: Map<string, any>({
    ets: Map<string, List<ITask>>(),
    tasksExecuted: List<string>()
  })
});

export interface IEditorState extends Map<string, any> {
  mode: EDITOR_MODES; /* mode of editor */
  canvasSize: {
    width: number,
    height: number
  };
  selectedTask: string;
  statusData: Map<string, any>;
  simulation: Map<string, any>;
}

export function deimmutifyEditorState(state: IEditorState): Object[] {
  return state.toJS();
}
