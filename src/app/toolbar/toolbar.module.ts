import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { ToolbarComponent }   from './toolbar.component';

@NgModule({
  imports:      [ CommonModule, FormsModule, NgbModule ],
  declarations: [ ToolbarComponent ],
  exports:      [ ToolbarComponent ],
})
export class ToolbarModule { }
