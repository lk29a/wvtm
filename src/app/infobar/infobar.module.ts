import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InfobarComponent} from './infobar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {IterablePipe} from "../shared/IterablePipe";
import {ModNodeComponent} from "./mod-node/mod-node.component";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule],
  declarations: [InfobarComponent, ModNodeComponent, IterablePipe],
  exports: [InfobarComponent],
})
export class InfobarModule {
}
