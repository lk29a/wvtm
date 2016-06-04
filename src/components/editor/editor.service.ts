import {Injectable, Inject} from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import {TaskModel, TaskType, TaskRelation} from '../../lib/taskmodel/taskmodel';
import {Task} from '../../lib/taskmodel/task';
import {EDITOR_MODES} from '../common/constants'
import {LoggerService} from '../common/logger.service'

interface ModelUpdateInfo {
  action: string,
  type: string,
  taskId: string
}
interface UserAction {
  type: string,
  action: string,
  data: any
}

@Injectable()
export class EditorService {
  private taskModel: TaskModel;
  private selectedTaskId: string;
  private selectedTaskNode: Task;
  private editorMode: EDITOR_MODES;
  private validataionInfo: any;

  private modelUpdatedSource = new Subject<ModelUpdateInfo>();
  private taskSelectedSource = new Subject<string>();
  private userActionSource = new Subject<UserAction>();
  modelUpdated$ = this.modelUpdatedSource.asObservable();
  taskSelected$ = this.taskSelectedSource.asObservable();
  userAction$ = this.userActionSource.asObservable();

  constructor( @Inject(LoggerService) private logger: LoggerService) {
    // this.createNew();
  }

  createNew() {
    this.taskModel = new TaskModel();
    this.selectedTaskId = this.taskModel.root.data.id;
    this.editorMode = EDITOR_MODES.DRAWING;
    this.taskSelectedSource.next(this.selectedTaskId);
  }

  getEditorMode() {
    return this.editorMode;
  }

  setEditorMode(mode: EDITOR_MODES) {
    this.editorMode = mode;
  }

  getTaskModel() {
    return this.taskModel;
  }

  selectTask(taskId: string) {
    this.selectedTaskId = taskId;
    this.userActionSource.next({ type: 'task', action: 'select', data: { taskId: taskId } });
  }

  unSelectTask() {
    this.selectedTaskId = this.selectedTaskNode = null;
    this.userActionSource.next({ type: 'task', action: 'unselect', data: null});
  }

  validateModel() {
    this.validataionInfo = this.taskModel.validateStructure();
    console.log(this.validataionInfo);
  }

  simulateModel() {
    if (this.editorMode === EDITOR_MODES.DRAWING) {
      this.userActionSource.next({ type: 'simulation', action: 'start', data: null });
      this.editorMode = EDITOR_MODES.SIMULATION;
    } else {
      this.editorMode = EDITOR_MODES.DRAWING;
    }
  }

  getTaskNode(taskId: string) {
    this.selectedTaskNode = this.taskModel.searchNode(taskId);
    return this.selectedTaskNode;
  }

  getTaskData(taskId: string) {
    if (this.selectedTaskNode.data.id != taskId) {
      this.getTaskNode(taskId);
    }

    return this.selectedTaskNode.data;
  }

  addUpdateTaskRelation(relation: string) {
    if (!this.selectedTaskId) {
      this.logger.error('Cannot add/update relation, select a task first');
      return;
    }
    this.taskModel.addUpdateRelation(this.selectedTaskId, relation);
    var updateInfo = {
      action: 'update',
      type: 'relation',
      taskId: this.selectedTaskId
    };
    this.modelUpdatedSource.next(updateInfo);
  }

  addTask(type: string) {
    if (!this.selectedTaskId) {
      this.logger.error('Cannot add new task, select a task first');
      return;
    }
    var newTaskId = this.taskModel.addTask({ parentTaskId: this.selectedTaskId, taskType: type });
    this.logger.debug(this.taskModel);
    var updateInfo = {
      action: 'add',
      type: 'task',
      taskId: newTaskId
    };
    this.modelUpdatedSource.next(updateInfo);
  }

  getTaskTypes() {
    return Object.keys(TaskType);
  }

  getTaskRelations() {
    return TaskRelation;
  }

}