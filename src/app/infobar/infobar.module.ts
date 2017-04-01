import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule, ReactiveFormsModule }        from '@angular/forms';
import { InfobarComponent }   from './infobar.component';
@NgModule({
  imports:      [ CommonModule, FormsModule, ReactiveFormsModule ],
  declarations: [ InfobarComponent ],
  exports:      [ InfobarComponent ],
})
export class InfobarModule { }
