import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { AppComponent }  from './app.component';
import { TaskModelActions } from "./taskmodel";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MenuComponent} from "./menu";
import {ToolbarComponent} from "./toolbar";
import {EditorComponent} from "./editor";
import {InfobarComponent} from "./infobar";
import { LoggerService } from "./shared";
import { NgRedux } from 'ng2-redux';

@NgModule({
  imports: [ BrowserModule, FormsModule, NgbModule],       // module dependencies
  declarations: [ AppComponent, MenuComponent, ToolbarComponent, InfobarComponent, EditorComponent],   // components and directives
  bootstrap: [ AppComponent ],     // root component
  providers: [NgRedux, LoggerService, TaskModelActions]    // services
})
export class AppModule { }