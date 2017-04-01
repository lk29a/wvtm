import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  AfterViewInit,
  ChangeDetectionStrategy,
  ElementRef
} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {List} from 'immutable';
import {NgRedux, select} from '@angular-redux/store';
import {SVGHelper} from '../shared';
import {IWVTMState} from '../../store';
import {ITask, ICoord, TaskModelActions} from '../../taskmodel';
import {TaskRelation} from '../../shared';
import {EditorActions} from '../editor.actions';

@Component({
  selector: 'g[task-node]',
  templateUrl: 'task-node.component.html',
  styleUrls: ['task-node.component.css'],
  providers: [SVGHelper]
  // directives: [TaskTreeComponent],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskNodeComponent implements OnInit, OnDestroy, OnChanges {

  // @Input() taskId: string;
  @Input() taskNode: ITask;

  private rxSubs: any = {};
  // taskNode: ITask;
  isSelecetd: Observable<boolean>;
  parentCoords: {
    x: number,
    y: number
  };
  rSiblingCoords: {
    x: number,
    y: number
  };
  subTasks: string[];
  clickTimer: any;
  preventClick: boolean = false;

  constructor(private redux: NgRedux<IWVTMState>,
              private editorActions: EditorActions,
              private taskModelActions: TaskModelActions,
              private el: ElementRef,
              private svgHelper: SVGHelper) {
  }

  ngOnInit() {
    // // subscribe to selected task
    this.rxSubs.selected = this.isSelecetd = this.redux.select(state => state.taskModel.selectedTask)
      .map(taskId => this.taskNode.id === taskId);

    // subscribe to parent task layout coords
    this.rxSubs.parentCoords = this.redux.select(state => {
      const parent = state.taskModel.tasks.getIn([this.taskNode.id, 'parent']);
      return state.taskModel.tasks.get(parent);
    })
      .subscribe(data => {
        if (data) {
          this.parentCoords = data.coords;
        }
      });

    // subscribe to right sibling task layout coords
    this.rxSubs.rSiblingCoords = this.redux.select(state => {
      const parent = state.taskModel.tasks.getIn([this.taskNode.id, 'parent']);
      if (parent) {
        const childs: List<string> = state.taskModel.tasks.getIn([parent, 'children']);
        const taskIdx = childs.indexOf(this.taskNode.id);
        if (childs.size > (taskIdx + 1)) {
          const rsib = state.taskModel.tasks.getIn([parent, 'children', taskIdx + 1]);
          return state.taskModel.tasks.get(rsib);
        }
      }
      return null;
    })
      .subscribe(data => {
        if (data) {
          this.rSiblingCoords = data.coords;
        }
      });
  }

  ngAfterViewInit() {
    // console.log(this.el.nativeElement);
  }

  onClick() {
    this.clickTimer = setTimeout(() => {
      if (!this.preventClick) {
        this.taskModelActions.selectTask(this.taskNode.id);
      }

      this.preventClick = false;
    }, 200);
  }

  onDblclick() {
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
    }

    this.preventClick = true;
    this.editorActions.simExecuteTask(this.taskNode.id);
  }

  getTaskTypeLink() {
    return `#def-${this.taskNode.type.toLowerCase()}`;
  }

  getParentLinkPath(): string {
    // console.log("parent link", this.taskNode.id, this.parentCoords);
    if (this.taskNode.parent) {
      return this.svgHelper.getParentLinkPath(this.taskNode.coords, this.parentCoords);
    } else {
      return '';
    }
  }

  getRelationLinkPath(): string {
    const relTextElm = this.el.nativeElement.querySelector('.rel-text');
    if (this.taskNode.relation) {
      return this.svgHelper.getRelationLinkPath(this.taskNode.coords, relTextElm.getBBox(), this.rSiblingCoords);
    }
    return '';
  }

  getRelationSym() {
    return TaskRelation[this.taskNode.relation].sym;
  }

  getRelationXCoord() {
    return this.taskNode.coords.x + (this.rSiblingCoords.x - this.taskNode.coords.x) / 2;
  }

  ngOnChanges(changes) {
    console.log('changed', this.taskNode.id);
  }

  ngOnDestroy() {
    for (const key in this.rxSubs) {
      if (this.rxSubs.hasOwnProperty(key)) {
        // console.log(key);
        this.rxSubs[key].unsubscribe();
      }
    }
    // this.rxSubs.unsubscribe();
  }

}
