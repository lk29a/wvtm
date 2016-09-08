declare var require: any;
import {Component, ElementRef, OnInit, AfterViewInit} from "@angular/core";
import {Observable} from "rxjs/Rx";
import { NgRedux, select } from "ng2-redux";
import { List } from "immutable";
import { EditorActions }      from "./editor.actions";
import {LoggerService } from "../shared";
import { IWVTMState } from "../store";
import {ITask} from "../taskmodel";

interface Dim {
  height: number,
  width: number
}

@Component({
  selector: "wvtm-editor",
  // moduleId: module.id,
  templateUrl: "editor.html",
  styleUrls: ["editor.css"],
  // directives: [TaskNodeComponent],
})
export class EditorComponent implements OnInit, AfterViewInit {

  // @select(["taskModel", "tasks"]) tasks: Observable<any>;
  @select(state => state.taskModel.tasks.toList()) tasks: Observable<List<ITask>>;
  statusData: any;
  // @select(state => state.taskModel.statusData.toJS()) status: Observable<any>;
  // tasks: Observable<Map<string, ITask>>;
  // tasks: Observable<any>;
  svgElm: HTMLElement;
  canvasDim: Dim = {
    height: null,
    width: null
  };

  constructor(private el: ElementRef,
    private editorActions: EditorActions,
    private redux: NgRedux<IWVTMState>,
    private logger: LoggerService) {
    this.logger.debug("Editor component initialized")
    Observable.fromEvent(window, "resize")
      .debounceTime(300)
      .subscribe((event) => {
        this.resizeCanvas(event);
      });

    this.redux.select(state => state.taskModel.statusData)
      .subscribe(data => {
        console.log("data");
        console.log(data);
        this.statusData = data;
      });
  }

  ngOnInit() {
  }

  resizeCanvas(event) {
    this.canvasDim.height = this.el.nativeElement.firstChild.clientHeight;
    this.canvasDim.width = this.el.nativeElement.firstChild.clientWidth;
  }

  ngAfterViewInit() {
    let dim = {
      height: this.el.nativeElement.firstChild.clientHeight,
      width: this.el.nativeElement.firstChild.clientWidth,
    };
    // set initial dimensions
    this.svgElm = this.el.nativeElement.querySelector("svg");
    this.svgElm.setAttribute("height", dim.height);
    this.svgElm.setAttribute("width", dim.width);
  }


};
