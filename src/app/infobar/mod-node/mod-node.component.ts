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
import {SVGHelper} from '../../editor/shared';
import {IWVTMState} from '../../store';
import {ITask, ICoord, TaskModelActions} from '../../taskmodel';
import {TaskRelation} from '../../shared';
import {EditorActions} from '../../editor/editor.actions';

@Component({
  selector: 'g[mod-node]',
  templateUrl: 'mod-node.component.html',
  styleUrls: ['mod-node.component.css'],
  providers: [SVGHelper],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModNodeComponent implements OnInit, OnDestroy, OnChanges {

  // @Input() taskId: string;
  @Input() modNode: ITask;

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
  preventClick = false;

  constructor(private redux: NgRedux<IWVTMState>,
              private editorActions: EditorActions,
              private taskModelActions: TaskModelActions,
              private el: ElementRef,
              private svgHelper: SVGHelper) {
  }

  ngOnInit() {
    // // subscribe to selected task
    this.rxSubs.selected = this.isSelecetd = this.redux.select(state => state.editorState.selectedTask)
      .map(taskId => this.modNode.id === taskId);

    // subscribe to parent task layout coords
    this.rxSubs.parentCoords = this.redux.select(state => {
      const parent = state.taskModel.tasks.getIn([this.modNode.id, 'parent']);
      return state.taskModel.tasks.get(parent);
    })
      .subscribe(data => {
        if (data) {
          this.parentCoords = data.coords;
        }
      });

    // subscribe to right sibling task layout coords
    this.rxSubs.rSiblingCoords = this.redux.select(state => {
      const parent = state.taskModel.tasks.getIn([this.modNode.id, 'parent']);
      if (parent) {
        const children: List<string> = state.taskModel.tasks.getIn([parent, 'children']);
        const taskIdx = children.indexOf(this.modNode.id);
        if (children.size > (taskIdx + 1)) {
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

  getTaskTypeLink() {
    return `#def-${this.modNode.type.toLowerCase()}`;
  }

  getParentLinkPath(): string {
    if (this.modNode.parent) {
      return this.svgHelper.getParentLinkPath(this.modNode.coords, this.parentCoords);
    } else {
      return '';
    }
  }

  getRelationLinkPath(): string {
    const relTextElm = this.el.nativeElement.querySelector('.rel-text');
    if (this.modNode.relation) {
      return this.svgHelper.getRelationLinkPath(this.modNode.coords, relTextElm.getBBox(), this.rSiblingCoords);
    }
    return '';
  }

  getRelationSym() {
    return TaskRelation[this.modNode.relation].sym;
  }

  getRelationXCoord() {
    return this.modNode.coords.x + (this.rSiblingCoords.x - this.modNode.coords.x) / 2;
  }

  ngOnChanges(changes) {
    // console.log('changed', this.taskNode.id);
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
