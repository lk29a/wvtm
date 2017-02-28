declare var require: any;

import {Component, OnInit, OnDestroy} from "@angular/core";
import {AsyncPipe, Control, FORM_DIRECTIVES} from "@angular/common";
import {Observable} from "rxjs/Rx";
import {List, Map} from "immutable";
import {NgRedux, select} from '@angular-redux/store';
import { IWVTMState } from "../store";
import { EDITOR_MODES } from "../shared";
import {TaskModelActions} from "../taskmodel"
import * as Immutable from 'immutable';
// const Immutable = require('immutable');

import {
  LoggerService,
  TaskType,
  TaskRelation
} from "../shared/index";

enum InfoTypes {
  None = 0,
  Task = 1,
  Validation = 2,
  Simulation = 3
}

@Component({
  selector: "wvtm-infobar",
  // moduleId: module.id,
  templateUrl: "infobar.html",
  directives: [FORM_DIRECTIVES],
  styleUrls: ["infobar.css"],
})
export class InfobarComponent implements OnInit, OnDestroy {
  @select(["taskmodel", "selectedTask"]) selectedTask: Observable<string>;
  // @select(["editorState", "mode"]) editorMode: Observable<EDITOR_MODES>;

  private nameField: Control = new Control();
  private descField: Control = new Control();
  private typeField: Control = new Control();
  private relationField: Control = new Control();

  currentTask: any = {};
  infobar: any;
  taskTypes;
  taskRelations;
  relations;
  types;
  infoType;
  vInfo: any = {};
  simData: Map<string, List<string>>;
  rxSubs: any = {};
  curTaskObj: any;

  constructor(private logger: LoggerService,
    private tmActions: TaskModelActions,
    private redux: NgRedux<IWVTMState>) {

    this.logger.debug("Infobar initialized");

    this.taskTypes = TaskType;
    this.types = Object.keys(this.taskTypes);
    this.taskRelations = TaskRelation;
    this.relations = Object.keys(this.taskRelations);
    this.infobar = {
      type: InfoTypes,
      title: "Information",
      error: false,
      errMsg: ""
    };
    this.infoType = InfoTypes;

    this.nameField.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(name => {
        this.updateTask("name", name);
      });

    this.descField.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(name => {
        this.updateTask("description", name);
      });

    this.typeField.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(name => {
        this.updateTask("type", name);
      });

    this.relationField.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(name => {
        this.updateTask("relation", name);
      });



    // this.wvtm.userAction$.subscribe(
    //       case "simulation":
    //         if (userAction.action === "start")
    //           this.showSimulationInfo(userAction.data);
    //         else if (userAction.action === "error") {
    //           this.infobar.error = true;
    //           this.infobar.errMsg = userAction.data;
    //         } else if (userAction.action === "stop")
    //           reset = true;
    //         break;

    //       case "validation":
    //         if (userAction.action === "start")
    //           this.showValidationInfo(userAction.data);
    //         else if (userAction.action === "stop")
    //           reset = true;
    //         break;

    //       default:
    //         reset = true;
    //         break;
    //     }

    //     if (reset) {
    //       this.resetInfoBar();
    //     }
    //   }
    // );
  }

  ngOnInit() {
    //selected task
    this.rxSubs.selectedTask = this.redux.select((state) => {
      let obj = null;
      let t = state.taskModel.tasks.get(state.taskModel.selectedTask);
      if (t && !Immutable.is(this.curTaskObj, t)) {
        let parent = state.taskModel.tasks.get(t.parent);
        this.curTaskObj = t;
        obj = {
          task: t,
          parent: parent
        };
      }
      return obj;
    }).subscribe(data => {
      this.showTaskInfo(data);
    });

    //editor mode
    this.rxSubs.editormode = this.redux.select(state => state.editorState.mode)
      .subscribe(mode => {
        if(mode === EDITOR_MODES.SIMULATION) {
          this.infobar.type = InfoTypes.Simulation;
        }
      });


    this.rxSubs.simulation = this.redux.select(state => state.editorState.simulation)
      .subscribe(simData => {
        // console.log(simData.toJS());
        this.simData = simData.toJS();
      });
  }

  showTaskInfo(data) {
    if (data) {
      this.infobar.type = InfoTypes.Task;
      let {task, parent} = data;

      let isLast = false;
      if (parent) {
        let idx = parent.children.indexOf(task.id);
        if (idx === (parent.children.size - 1))
          isLast = true;
      }

      this.currentTask = {
        id: task.id,
        type: task.type,
        relation: task.relation,
        name: task.name,
        description: task.description,
        children: task.children,
        isRoot: task.parent ? false : true,
        isLast: isLast,
      };
      this.infobar.title = "Task: " + this.currentTask.name;
    }
  }

  resetInfoBar() {
    this.infobar.type = null;
  }

  simulationAction(action: string, data: any) {
    switch (action) {
      case "start":
        this.showSimulationInfo(data);
        break;

      case "update":
        this.updateSimulationInfo(data);
        break;

      case "stop":
        this.resetInfoBar();
        break;
    }
  }

  showSimulationInfo(data) {
    this.infobar.type = InfoTypes.Simulation;
    this.infobar.title = "Simulation";
    // this.simData.ets = data;
  }

  updateSimulationInfo(data) {
    // this.simData.ets = data;
  }

  showValidationInfo(data) {
    this.infobar.type = InfoTypes.Validation;
    this.infobar.title = "Validation Information";
    this.vInfo = data;
  }

  deleteTask() {
    let okToDelete = true;
    if (this.currentTask.children.size > 0) {
      let msg = "Warning: This will also remove the all subtasks\n Are you sure?";
      okToDelete = window.confirm(msg);
    }
    if (okToDelete)
      this.tmActions.removeTask(this.currentTask.id);
  }

  addToLibrary() {
    this.tmActions.newModule(this.currentTask.id);
  }

  updateTask(type, value) {
    if (this.currentTask[type] === value)
      return;

    // this.tmActions.updateTask(this.currentTask.id, type, value);
    this.tmActions.updateTask(type, value);
  }

  getRelationSym(relation) {
    return this.taskRelations[relation];
  }

  ngOnDestroy() {
    for (let key in this.rxSubs) {
      if (this.rxSubs.hasOwnProperty(key))
        this.rxSubs[key].unsubscribe();
    }
  }
}
