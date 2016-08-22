import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { MenuComponent }   from './menu.component';
@NgModule({
  imports:      [ CommonModule, FormsModule ],
  declarations: [ MenuComponent ],
  exports:      [ MenuComponent ],
})
export class MenuModule { }
