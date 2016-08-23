import { NgModule, ApplicationRef }      from '@angular/core';
import { CommonModule }      from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { AppComponent }  from './app.component';
import { TaskModelActions } from "./taskmodel";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MenuModule} from "./menu";
import {ToolbarModule} from "./toolbar";
import {EditorModule} from "./editor";
import {InfobarModule} from "./infobar";
import { LoggerService } from "./shared";
import { NgRedux } from 'ng2-redux';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    NgbModule,
    MenuModule,
    ToolbarModule,
    EditorModule,
    InfobarModule
  ],
  declarations: [ AppComponent ],   // components and directives
  providers: [NgRedux, LoggerService, TaskModelActions],    // services
  bootstrap: [ AppComponent ]     // root component
})
export class AppModule { }
