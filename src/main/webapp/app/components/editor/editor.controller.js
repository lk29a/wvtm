(function() {
  'use strict';

  angular.module('WVTM.editor')
    .controller('EditorController', EditorController);

  EditorController.$inject = ['$scope', 'EditorService', 'TaskType', 'TaskRelation', 'Renderer', 'ModalService'];

  function EditorController($scope, EditorService, TaskType, TaskRelation, Renderer, ModalService) {
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
    // var modelGroup = paper.select('#model-group');

    this.init = function() {
      if (!this.taskModel) {
        this.taskModel = EditorService.newInstance();
        EditorService.test123();
        this.currentTask = this.taskModel.root;
        _this.infoModel.type = _this.currentTask.data.type;
        _this.infoModel.relation = _this.currentTask.relation;
        //render initial model
      }

      Renderer.init('editor-canvas');
      _this.render();

      paper = Renderer.getPaper();
      modelGroup = paper.select('#model-group');
    };

    this.addTask = function(type) {
      if (!_this.selectedTaskId) {
        throw new Error('cannot add new task, select a task first');
      }
      EditorService.addTask({
        parentTaskId: this.selectedTaskId,
        taskType: type
      });
      $scope.$broadcast('wvtm:model:update', {
        type: 'task',
        taskId: this.selectedTaskId
      });
    };

    this.addRelation = function(relation) {
      if (!_this.selectedTaskId) {
        throw new Error('cannot add relation, select a task first');
      }
      EditorService.addRelation(_this.selectedTaskId, relation);
      $scope.$broadcast('wvtm:model:update', {
        type: 'relation',
        taskId: _this.selectedTaskId
      });
    };


    this.addToLibrary = function() {
      if (!_this.currentTask) {
        return;
      }
      //open modal to show user what he is adding to library
      ModalService.open({
        templateUrl: 'app/partials/librarymodal.html',
        params: {
          msg: 'hello, is anybody in there'
        },
        pipe: false
      });

      // EditorService.addToLibrary(_this.currentTask);

      // $scope.$broadcast('wvtm:model:update', {
      //   type: 'task',
      //   taskId: this.selectedTaskId
      // });
    };

    this.render = function() {
      Renderer.render(_this.taskModel);
    };

    this.validateStructure = function() {
      EditorService.validateStructure();
    };


    this.selectTask = function(taskId) {
      if (_this.curState.mode === 'simulation') {
        angular.noop();
      } else {
        _this.selectedTaskId = taskId;
        var selectedTask = modelGroup.select("#" + taskId);
        Renderer.selectEffect(selectedTask);
        $scope.$apply(function() {
          _this.currentTask = selectedTask.data('origNode');
          _this.infoModel.type = _this.currentTask.data.type;
          _this.infoModel.relation = _this.currentTask.relation;
          console.log(_this.infoModel);
        });
      }
    };

    this.hoverTask = function(taskId) {
      if (_this.curState.mode === 'simulation') {
        angular.noop();
      } else {
        var hoveredTask = modelGroup.select("#" + taskId);
        Renderer.highlightTask(hoveredTask);
      }
    };

    this.dbClickTask = function(taskId) {
      if (_this.curState.mode === 'simulation') {
        var curTask = _this.taskModel.searchNode(taskId);
        var ets = EditorService.performTask(curTask);

        if (ets.length === 0) {
          Renderer.stopSimulation();
        } else {
          Renderer.updateSimulation(ets);
        }
      }
    };

    // this.updateTaskName = function() {
    // 	if(_this.selectedTask) {
    // 		_this.selectedTask.data.name = _this.infoModel.name;
    // 	}
    // };

    // this.updateTaskDesc = function() {
    // 	if(_this.selectedTask) {
    // 		_this.selectedTask.data.desc = _this.infoModel.name;
    // 	}
    // };

    this.updateTaskType = function() {
      if (_this.currentTask) {
        _this.currentTask.data.type = _this.infoModel.type;
        $scope.$broadcast('wvtm:model:update', {
          type: 'task',
          taskId: this.selectedTaskId
        });
      }
    };

    this.updateTaskRelation = function() {
      if (_this.currentTask) {
        _this.currentTask.relation = _this.infoModel.relation;
        $scope.$broadcast('wvtm:model:update', {
          type: 'relation',
          taskId: _this.selectedTaskId
        });
      }
    };


    this.simulate = function() {
      if (_this.curState.mode === 'editor') {
        //unselect previous selected task if any

        var ets = EditorService.simulateModel();
        console.log(ets);
        _this.curState.mode = 'simulation';
        Renderer.startSimulation(ets);
      } else {
        _this.curState.mode = 'editor';
        Renderer.stopSimulation();
      }
    };
  }

})();
