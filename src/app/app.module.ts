import { NgModule }      from '@angular/core';
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
    FormsModule,
    NgbModule,
    MenuModule,
    ToolbarModule,
    EditorModule,
    InfobarModule
  ],
  declarations: [ AppComponent ],   // components and directives
  bootstrap: [ AppComponent ],     // root component
  providers: [NgRedux, LoggerService, TaskModelActions]    // services
})
export class AppModule { }
