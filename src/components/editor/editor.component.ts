import {Component} from "@angular/core";

import {EditorMenu} from "../editor-menu/menu.component";
import {EditorToolbar} from "../editor-toolbar/toolbar.component";
import {EditorCanvas} from "../editor-canvas/canvas.component";
import {EditorInfobar} from "../editor-infobar/infobar.component";
import {EditorService} from './editor.service';
import {TaskModel} from '../../lib/taskmodel/taskmodel';
import {Renderer} from '../renderer/renderer.service';
import {TreeLayout} from '../renderer/treelayout';
import { LoggerService } from '../common/logger.service';


@Component({
	selector: 'wvtm-editor',
	templateUrl: 'src/components/editor/editor.html',
	styleUrls: ['src/components/editor/editor.css'],
  providers: [EditorService, Renderer, TreeLayout],
	directives: [EditorMenu, EditorToolbar, EditorCanvas, EditorInfobar],
})
export class WVTMEditor {
  taskModel: TaskModel = null;
  constructor(editorService: EditorService, loggerService: LoggerService) {
    this.taskModel = editorService.getTaskModel();
	}

  
};