import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TaskModelActions } from './taskmodel';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { StoreModule } from './store';
import {MenuModule} from './menu';
import {ToolbarModule} from './toolbar';
import {EditorModule} from './editor';
import {InfobarModule} from './infobar';
import { LoggerService } from './shared';
import {IterablePipe} from "./shared/IterablePipe";
import {TaskNodeComponent} from "./editor/task-node/task-node.component";


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
    NgReduxModule,
    StoreModule,
    MenuModule,
    ToolbarModule,
    EditorModule,
    InfobarModule
  ],
  declarations: [ AppComponent],   // components and directives
  providers: [LoggerService, TaskModelActions],    // services
  bootstrap: [ AppComponent ]     // root component
})
export class AppModule {}

