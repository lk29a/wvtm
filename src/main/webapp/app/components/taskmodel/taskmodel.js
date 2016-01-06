(function(){
	'use strict';

	angular.module('WVTM.TaskModel')
	.factory('TaskModel', taskModelFactory);

	taskModelFactory.$inject = ['TaskType', 'TaskRelation', 'GenericTree', 'TreeNode'];

	function taskModelFactory(TaskType, TaskRelation, GenericTree, TreeNode){

		function TaskModel(data) {
			data = data || {};
			this.taskCounter = 0;
			this.name = data.name || '';
			this.description = data.description || '';
			this.taskTree = null;
			this.simulation = {};

			GenericTree.call(this, {
				type: TaskType.ABSTRACT,
				id: 'TASK_' + (this.taskCounter++), //@lk comeup with some naming convention
				name: 'A',
				action: '',
				description: '',
			});
		}

		//extend generic tree
		TaskModel.prototype = Object.create(GenericTree.prototype);
		TaskModel.prototype.constructor = TaskModel;

		TaskModel.prototype.addTask = function (options) {
			if(angular.isUndefined(options.parentTaskId) || options.parentTaskId === null) {
				throw new Error('`parentId` must be provided');
			}

			if(angular.isUndefined(options.taskType) || options.taskType === null) {
				throw new Error('`type` of task must be provided');
			}

			var parentNode = this.searchNode(options.parentTaskId);

			var data = {
				type: TaskType[options.taskType.toUpperCase()] || TaskType.ABSTRACT,
				id: 'TASK_' + (this.taskCounter++), //@lk comeup with some naming convention
				name: options.name || '',
				description: options.name || '',
				relation: options.action || '',
			};
			this.addNode(parentNode, data);
		};

		TaskModel.prototype.addRelation = function(parentTaskId, relation) {
			if(angular.isUndefined(parentTaskId) || parentTaskId === null) {
				throw new Error('`parentId` must be provided');
			}
			if(!TaskRelation[relation.toUpperCase()]) {
				throw new Error('Please provide a valid relation');
			}

      if (parentTaskId instanceof TreeNode) {
				parentTaskId.addRelation(TaskRelation[relation.toUpperCase()]);
      } else {
				parentTaskId = this.searchNode(parentTaskId);
				parentTaskId.addRelation(TaskRelation[relation.toUpperCase()]);
      }
		};


		/**
		 * Check correctness of the model
		 * 1. Abstract task should have atleast one child
		 * 2. Every sibling pair should have a relation
		 */
		TaskModel.prototype.validateStructure = function() {
			var valid = true;
			function validateTask(task) {
				if(task.isLeaf()) {
					if(task.data.type === TaskType.ABSTRACT) {
						console.log('Warning: "' + task.data.name + '" is abstract type. Task should have subtasks.');
					}
				}

				if(!task.relation) {
					if(task.parent && (task.parent.getLastChild() !== task)) {
						valid = false;
						console.log('Error: "' + task.data.name + '" must have a relation with its right sibling.');
					}
				}
			}
			this.traverseDF(validateTask);
			return valid;
		};

		/**
		 * Simulate the model 
		 * @return {[type]} [description]
		 */
		TaskModel.prototype.simulate = function() {
		};



		return TaskModel;
	}


})();	