(function(){
	'use strict';

	angular.module('WVTM.editor')
	.controller('EditorController', EditorController);

	EditorController.$inject = ['$scope', 'EditorService', 'TaskType', 'TaskRelation', 'TaskModelSimulator'];
	function EditorController($scope, EditorService, TaskType, TaskRelation, TaskModelSimulator){
		var _this = this;

		this.curState = {
			simulating: false,
		};

		this.test = "test";
		this.selectedTaskId = null;
		this.taskModel = null;
		this.currentTask = null;
		this.taskTypes = TaskType;
		this.taskRelations = TaskRelation;


		(function init() {
			if(!this.taskModel) {
				this.taskModel = EditorService.newInstance();
				EditorService.test123();
				this.currentTask = this.taskModel.root;
			}
		}).call(this);

		this.addTask = function(type) {
			console.log(_this.selectedTask);
			if(!_this.selectedTaskId) {
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
			if(!_this.selectedTaskId) {
				throw new Error('cannot add relation, select a task first');
			}
			EditorService.addRelation(_this.selectedTaskId, relation);
			$scope.$broadcast('wvtm:model:update', {
				type: 'relation',
				taskId: _this.selectedTaskId
			});
		};

		this.validateStructure = function() {
			EditorService.validateStructure();
		};

		this.simulate = function() {
			if(!this.curState.simulating) {
				var ets = EditorService.simulateModel();

				$scope.$broadcast('wvtm:simulation', {
					type: 'start',
					ets: ets
				});
			} else {
				$scope.$broadcast('wvtm:simulation', {
					type: 'stop',
				});
			}
			this.curState.simulating = !this.curState.simulating;
		};
	}

})();