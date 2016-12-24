import {Component, ElementRef, OnInit, AfterViewInit} from "@angular/core";
import {Observable} from "rxjs/Rx";
import { NgRedux, select } from "ng2-redux";
import { List, Map } from "immutable";
import { EditorActions } from "./editor.actions";
import {LoggerService, EDITOR_MODES } from "../shared";
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

  // @select(state => state.taskModel.tasks.toList()) tasks: Observable<List<ITask>>;
  tasks: Map<string, ITask>;
  // tasks: List<ITask>;
  statusData: any;
  editorMode: EDITOR_MODES;
  simMask: string;
  simEts: List<string>;
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
        this.statusData = data;
      });

      this.editorMode = EDITOR_MODES.DRAWING;
      this.simMask = ``;
      this.simEts = List<string>();
  }

  ngOnInit() {
    this.redux.select(state => state.taskModel.tasks)
      .subscribe(data => {
        this.tasks = data;
      });

      this.redux.select(state => state.editorState)
        .subscribe(editorState => {
          if(this.editorMode === EDITOR_MODES.DRAWING && editorState.mode === EDITOR_MODES.SIMULATION)
            this.startSimulation(editorState.simulation);

          if(this.editorMode === EDITOR_MODES.SIMULATION && editorState.mode === EDITOR_MODES.SIMULATION)
            this.updateSimulation(editorState.simulation);

          if(this.editorMode === EDITOR_MODES.SIMULATION && editorState.mode === EDITOR_MODES.DRAWING)
            this.stopSimulation();
          // console.log(simData.toJS());
        });


  }

  startSimulation(simData) {
    this.editorMode = EDITOR_MODES.SIMULATION;
    this.simMask = `url(#simmask)`;
    this.updateSimulation(simData);
  }

  updateSimulation(simData) {
    this.simEts = simData.get("ets");
  }

  stopSimulation() {
    this.editorMode = EDITOR_MODES.DRAWING;
    this.simMask = ``;
  }

  getTaskCoordsX(taskId) {
    return this.tasks.getIn([taskId, "coords"]).x - 23;
  }

  getTaskCoordsY(taskId) {
    return this.tasks.getIn([taskId, "coords"]).y - 23;
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

    let svgMask = this.el.nativeElement.querySelector("#simmask rect");
    svgMask.setAttribute("height", dim.height);
    svgMask.setAttribute("width", dim.width);
  }
};
