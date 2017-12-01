import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Map } from "immutable";

@Component({
  selector: 'status-bar',
  templateUrl: 'status-bar.component.html',
  styleUrls: ['status-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBarComponent implements OnInit, OnChanges {
  @Input() statusData: Map<string, any>;
  // validation = {
  //   valid: false
  // }

  constructor() {
  }

  ngOnInit() {
    // if(this.statusData.has("validation")) {
    //   this.validation = this.statusData.get("validation");
    // }
  }

  ngOnChanges() {
    // console.log("changed", this.statusData.get("validation"));
  }

  isValid() {
    return this.statusData.get('validation').valid;
  }

}
