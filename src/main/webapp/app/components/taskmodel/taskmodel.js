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
				name: options.name || (options.taskType + '_' +  this.taskCounter),
				description: '',
				relation: options.relation || '',
			};
			this.addNode(parentNode, data);
		};

		TaskModel.prototype.addUpdateRelation = function(taskId, relation) {
			if(angular.isUndefined(taskId) || taskId === null) {
				throw new Error('`taskId` must be provided');
			}
			if(!TaskRelation[relation.toUpperCase()]) {
				throw new Error('Please provide a valid relation');
			}

      if (taskId instanceof TreeNode) {
				taskId.addRelation(TaskRelation[relation.toUpperCase()]);
      } else {
				taskId = this.searchNode(taskId);
				taskId.addRelation(TaskRelation[relation.toUpperCase()]);
      }
		};


		TaskModel.prototype.changeTaskType = function(taskId, taskType) {
			if(angular.isUndefined(taskId) || taskId === null) {
				throw new Error('`taskId` must be provided');
			}

			if(angular.isUndefined(taskType) || taskType === null) {
				throw new Error('`taskType` of task must be provided');
			}

			console.log(taskId, taskType);

      if (!(taskId instanceof TreeNode)) {
				taskId = this.searchNode(taskId);
				// taskId.addRelation(TaskRelation[relation.toUpperCase()]);
      } 

			taskId.data.type = taskType;
		};		

		/**
		 * Check correctness of the model
		 * 1. Abstract task should have atleast one child
		 * 2. Every sibling pair should have a relation
		 */
		TaskModel.prototype.validateStructure = function() {
			var validationObj = {
				messages:	[],
				valid: true,
				warnCount: 0,
				errorCount: 0
			};
			function validateTask(task) {
				if(task.isLeaf() && (task.data.type === TaskType.ABSTRACT)) {
					// console.log('Warning: "' + task.data.name + '" is abstract type. Task should have subtasks.');
					validationObj.messages.push('Warning: Task "' + task.data.name + '" is abstract type. Task should have subtasks.');
					validationObj.warnCount++;
				}

				if(!task.data.relation && (task.getRightSibling() !== null)) {
					// if(task.parent && (task.parent.getLastChild() !== task)) {
						validationObj.valid = false;
						// console.log('Error: "' + task.data.name + '" must have a relation with its right sibling.');
						validationObj.messages.push('Error: Task "' + task.data.name + '" must have a relation with its right sibling.');
						validationObj.errorCount++;
					// }
				}
			}
			this.traverseDF(validateTask);
			return validationObj;
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