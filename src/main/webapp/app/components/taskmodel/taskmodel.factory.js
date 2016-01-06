(function(){
	'use strict';

	angular.module('WVTM.TaskModel')
	.factory('TaskModel', taskModelFactory);

	taskModelFactory.$inject = ['TaskType', 'GenericTree', 'TaskModelRenderer'];

	function taskModelFactory(TaskType, Tree, TaskModelRenderer){

		var taskCounter = 0;
		var model = {
			name: '',
			description: '',
			taskTree: null,
			prevAction: [],
			nextActions: [],
		};

		var service = {
			createNew: createNew,
			getModel: getModel,
			addTask: addTask,
			renderModel: renderModel
		};

		return service;


		/************************************/

		function createNew() {
			model = {
				name: '',
				description: '',
				taskTree: null,
				prevAction: [],
				nextActions: [],
			};

			model.taskTree = new Tree({
				type: TaskType.ABSTRACT,
				id: 'TASK_' + (taskCounter++), //@lk comeup with some naming convention
				name: 'a',
				action: '',
				description: '',
			});

			return model;
		}

		function getModel() {
			return model;
		}


		function addTask(parentTaskId, taskType, name) {
			if(angular.isUndefined(parentTaskId) || parentTaskId === null) {
				throw new Error('`parentId` must be provided');
			}

			if(angular.isUndefined(taskType) || taskType === null) {
				throw new Error('`type` of task must be provided');
			}

			var parentNode = model.taskTree.searchNode(parentTaskId);

			var data = {
				type: TaskType[taskType.toUpperCase()] || TaskType.ABSTRACT,
				id: 'TASK_' + (taskCounter++), //@lk comeup with some naming convention
				name: name,
				action: '',
				description: '',
			};
			model.taskTree.addNode(parentNode, data);
		}


		function renderModel() {
			TaskModelRenderer.render();
		}

	}


})();	