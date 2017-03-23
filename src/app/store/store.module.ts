import { NgModule } from '@angular/core';
import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store';

import * as createLogger from 'redux-logger';
import {IWVTMState} from './root.types';
import { rootReducer } from './root.reducer';
import * as taskModel from "../taskmodel";
import * as editor from "../editor";

@NgModule({
  imports: [NgReduxModule],
})
export class StoreModule {
  constructor(public store: NgRedux<IWVTMState>, devTools: DevToolsExtension) {
    store.configureStore(
      rootReducer,
      {},
      [ createLogger({
        level: 'info',
        collapsed: true,
        stateTransformer: StoreModule.deimmutify
      })],
      devTools.isEnabled() ? [ devTools.enhancer() ] : []);
  }

  static deimmutify(state: IWVTMState): Object {
    return {
      taskModel: taskModel.deimmutifyTaskModel(state.taskModel),
      editorState: editor.deimmutifyEditorState(state.editorState),
    };
  }
}
