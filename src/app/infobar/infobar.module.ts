import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule, ReactiveFormsModule }        from '@angular/forms';
import { InfobarComponent }   from './infobar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports:      [ CommonModule, FormsModule, ReactiveFormsModule, NgbModule ],
  declarations: [ InfobarComponent ],
  exports:      [ InfobarComponent ],
})
export class InfobarModule { }
