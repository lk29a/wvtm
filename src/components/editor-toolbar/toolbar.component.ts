import {Component} from '@angular/core';
import {EditorService} from '../editor/editor.service';
import {TaskType, TaskRelation} from '../../lib/taskmodel/taskmodel'
import {LoggerService} from '../common/logger.service'

@Component({
  selector: 'editor-toolbar',
  templateUrl: 'src/components/editor-toolbar/toolbar.html',
  styleUrls: ['src/components/editor-toolbar/toolbar.css'],
  host: {
    '(click)': 'onClick($event)'
  }
})
export class EditorToolbar {
	taskTypes = Object.keys(TaskType);
	relations = Object.keys(TaskRelation);
	taskRelations = null;

  constructor(private editorService: EditorService, private logger: LoggerService) {
    this.taskRelations = TaskRelation;
  }

  onClick(event) {
    var elm = event.target;
    if (elm.classList.contains('toolbar-btn') || elm.parentNode.classList.contains('toolbar-btn')) {
      var action: string = elm.getAttribute('action') || elm.parentNode.getAttribute('action');
      var type: string = elm.getAttribute(action) || elm.parentNode.getAttribute(action);


      if (action.toLowerCase() == 'task') {
        this.editorService.addTask(type);
      }
      if (action.toLowerCase() == 'relation') {
        this.editorService.addUpdateTaskRelation(type);
      }
    }
    
  }
};