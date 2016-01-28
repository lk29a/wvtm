(function(){
	'use strict';

	angular.module('WVTM.editor')
	.controller('CanvasController', CanvasController);

	CanvasController.$inject = ['Renderer', 'EditorService'];
	function CanvasController(Renderer, EditorService){
		var _this = this;

    this.curState = {
      mode: 'editor',
    };

    this.infoModel = {
      name: '',
      type: '',
      desc: '',
      relation: ''
    };

    this.test = "test";
    this.selectedTaskId = null;
    this.taskModel = null;
    this.currentTask = null;
    this.taskTypes = TaskType;
    this.taskRelations = TaskRelation;

    var paper = null,
      modelGroup = null;


    this.init = function() {
      if (!_this.taskModel) {
        _this.taskModel = EditorService.newInstance();
        EditorService.test123();
        _this.currentTask = _this.taskModel.root;
        _this.infoModel.type = _this.currentTask.data.type;
        _this.infoModel.relation = _this.currentTask.relation;
        //render initial model
      }

      Renderer.init('editor-canvas');
      _this.render();

      paper = Renderer.getPaper();
      modelGroup = paper.select('#model-group');
    };		
	}
	
})();