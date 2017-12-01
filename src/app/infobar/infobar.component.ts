import {EditorActions} from "../editor/editor.actions";

declare var require: any;

import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Rx';
import {List, Map} from 'immutable';
import {NgRedux, select} from '@angular-redux/store';
import {IWVTMState} from '../store';
import {EDITOR_MODES} from '../shared';
import {TaskModelActions} from '../taskmodel';
import * as Immutable from 'immutable';

import {
  LoggerService,
  TaskType,
  TaskRelation
} from '../shared/index';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {ITask} from "../taskmodel/taskmodel.types";
import {TreeUtils} from "../taskmodel/treeutils";
import {getModuleTasks} from "./infoUtils";

enum InfoTypes {
  None = 0,
  Task = 1,
  Validation = 2,
  Simulation = 3
}

@Component({
  selector: 'wvtm-infobar',
  // moduleId: module.id,
  templateUrl: 'infobar.html',
  styleUrls: ['infobar.css'],
})
export class InfobarComponent implements OnInit, OnDestroy {
  @select(['taskmodel', 'selectedTask']) selectedTask: Observable<string>;
  // @select(["editorState", "mode"]) editorMode: Observable<EDITOR_MODES>;

  private nameField: FormControl = new FormControl();
  private descField: FormControl = new FormControl();
  private typeField: FormControl = new FormControl();
  private relationField: FormControl = new FormControl();

  moduleTasks: Map<string, ITask>;
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
  tasks: Map<string, ITask>;
  treeUtils: TreeUtils;
  rootTask: string;
  closeResult: string;

  constructor(private logger: LoggerService,
              private tmActions: TaskModelActions,
              private redux: NgRedux<IWVTMState>,
              private modalService: NgbModal) {

    this.logger.debug('Infobar initialized');

    this.taskTypes = TaskType;
    this.types = Object.keys(this.taskTypes);
    this.taskRelations = TaskRelation;
    this.relations = Object.keys(this.taskRelations);
    this.infobar = {
      type: InfoTypes.None,
      title: 'Information',
      error: false,
      errMsg: ''
    };
    this.infoType = InfoTypes;

    this.nameField.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(name => {
        this.updateTask('name', name);
      });

    this.descField.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(name => {
        this.updateTask('description', name);
      });

    this.typeField.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(name => {
        this.updateTask('type', name);
      });

    this.relationField.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(name => {
        this.updateTask('relation', name);
      });
  }

  ngOnInit() {
    this.rxSubs.alltasks = this.redux.select(state => state.taskModel)
      .subscribe(taskModel => {
        this.tasks = taskModel.tasks;
        this.rootTask = taskModel.treeRoot;
        this.treeUtils = new TreeUtils(this.tasks, this.rootTask);
      });

    // selected task
    this.rxSubs.selectedTask = this.redux.select((state) => {
      let obj = null;
      const t = state.taskModel.tasks.get(state.taskModel.selectedTask);
      if (t && !Immutable.is(this.curTaskObj, t)) {
        const parent = state.taskModel.tasks.get(t.parent);
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

    // editor mode
    this.rxSubs.editormode = this.redux.select(state => state.editorState.mode)
      .subscribe(mode => {
        if (mode === EDITOR_MODES.SIMULATION) {
          this.infobar.type = InfoTypes.Simulation;
        }
        if (mode === EDITOR_MODES.DRAWING) {
          this.infobar.type = InfoTypes.None;
        }
      });

    this.rxSubs.simulation = this.redux.select(state => state.editorState.simulation)
      .subscribe(simData => {
        this.simData = simData.get('ets').toJS();
      });

    this.rxSubs.validation = this.redux.select(state => state.taskModel.statusData)
      .subscribe(validationData => {
        const lastAction = this.redux.getState().lastAction;
        if (lastAction.type === EditorActions.VALIDATION_INFO) {
          this.showValidationInfo(validationData.get('validation'));
        }
      })
  }

  showTaskInfo(data) {
    if (data) {
      this.infobar.type = InfoTypes.Task;
      const {task, parent} = data;

      let isLast = false;
      if (parent) {
        const idx = parent.children.indexOf(task.id);
        if (idx === (parent.children.size - 1)) {
          isLast = true;
        }
      }

      this.currentTask = {
        id: task.id,
        type: task.type,
        relation: task.relation,
        name: task.name,
        description: task.description,
        children: task.children,
        isRoot: !task.parent,
        isLast: isLast,
      };
      this.infobar.title = 'Task: ' + this.currentTask.name;
    }
  }

  resetInfoBar() {
    this.infobar.type = InfoTypes.None;
  }

  simulationAction(action: string, data: any) {
    switch (action) {
      case 'start':
        this.showSimulationInfo(data);
        break;

      case 'update':
        this.updateSimulationInfo(data);
        break;

      case 'stop':
        this.resetInfoBar();
        break;
    }
  }

  showSimulationInfo(data) {
    this.infobar.type = InfoTypes.Simulation;
    this.infobar.title = 'Simulation';
    // this.simData.ets = data;
  }

  updateSimulationInfo(data) {
    // this.simData.ets = data;
  }

  showValidationInfo(data) {
    this.infobar.type = InfoTypes.Validation;
    this.infobar.title = 'Validation Information';
    this.vInfo = data;
  }

  deleteTask() {
    let okToDelete = true;
    if (this.currentTask.children.size > 0) {
      const msg = 'Warning: This will also remove the all sub-tasks\n Are you sure?';
      okToDelete = window.confirm(msg);
    }
    if (okToDelete) {
      this.tmActions.removeTask(this.currentTask.id);
    }
  }

  addToLibrary(content) {
    this.moduleTasks = getModuleTasks(this.tasks, this.currentTask.id);
    this.open(content);

    // this.tmActions.newModule(this.currentTask.id);
  }
  open(content) {
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  updateTask(type, value) {
    if (this.currentTask[type] === value) {
      return;
    }

    // this.tmActions.updateTask(this.currentTask.id, type, value);
    this.tmActions.updateTask(type, value);
  }

  getRelationSym(relation) {
    return this.taskRelations[relation];
  }

  getTaskName(taskId: string) {
    return this.tasks.get(taskId).name;
  }

  ngOnDestroy() {
    for (const key in this.rxSubs) {
      if (this.rxSubs.hasOwnProperty(key)) {
        this.rxSubs[key].unsubscribe();
      }
    }
  }
}
