import {Component} from '@angular/core';
// import {TaskType, TaskRelation} from '../../lib/taskmodel/taskmodel'
import {EditorService} from '../editor/editor.service'

@Component({
	selector: 'editor-infobar',
	templateUrl: 'src/components/editor-infobar/infobar.html',
	styleUrls: ['src/components/editor-infobar/infobar.css'],
})
export class EditorInfobar {
	currentTask = {
    data: {}
  };
  infoModel = {};
  taskTypes;
  taskRelations;
  relations;

  constructor(private editorService: EditorService) {
    this.taskTypes = editorService.getTaskTypes();
    this.taskRelations = editorService.getTaskRelations();
    this.relations = Object.keys(this.taskRelations);
  }

  getRelationSym(relation) {
    return this.taskRelations[relation];
  }

};