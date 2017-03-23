import { Map, List } from "immutable";
import { EditorActions } from "./editor.actions";
import { IEditorState } from "./editor.types";
import {createNew} from "./shared/editor.service";
import { Simulator } from "../simulator";
import { EDITOR_MODES } from "../shared";

const INITIAL_STATE: IEditorState = createNew()

let simulator: Simulator = null;

function simulation(state: Map<string, List<string>>, action): Map<string, List<string>> {

  switch(action.type) {
    case EditorActions.SIMULATION_START:
      simulator = new Simulator(action.payload.taskModel.tasks, action.payload.taskModel.treeRoot);
      return state.set("ets", simulator.start());

    case EditorActions.SIMULATE_TASK:
      // return simulator.executeTask(action.payload.task);

    case EditorActions.SIMULATION_STOP:
      return state.set("ets", state.get('ets').clear());
      // return simulator.stop();

    default:
      return state;
  }
}

export function editorStateReducer(state: IEditorState = INITIAL_STATE, action): IEditorState {
  if (!action.type || !action.payload) {
    return state;
  }

  switch (action.type) {
    case EditorActions.EDITOR_MODE_CHANGE:
      return state.set("mode", action.payload.mode) as IEditorState;

    case EditorActions.SIMULATION_START:
    case EditorActions.SIMULATE_TASK:
    case EditorActions.SIMULATION_STOP:
      return state.set("simulation", simulation(state.simulation, action)) as IEditorState;


    default:
      return state;
  }

}
