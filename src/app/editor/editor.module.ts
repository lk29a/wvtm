import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {EditorComponent} from './editor.component';
import {EditorActions} from "./editor.actions";
import {StatusBarComponent} from './status-bar/status-bar.component';
import {TaskNodeComponent} from "./task-node/task-node.component";

@NgModule({
  imports:      [ CommonModule, FormsModule ],
  declarations: [ EditorComponent, TaskNodeComponent, StatusBarComponent],
  exports:      [ EditorComponent ],
  providers: [EditorActions]
})
export class EditorModule { }
