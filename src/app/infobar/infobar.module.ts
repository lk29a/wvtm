import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { InfobarComponent }   from './infobar.component';
@NgModule({
  imports:      [ CommonModule, FormsModule ],
  declarations: [ InfobarComponent ],
  exports:      [ InfobarComponent ],
})
export class InfobarModule { }
