import {Task} from './task';
import {GenericTree} from '../generic-tree/generic-tree';

export var TaskType = {
	Abstract: 0,
	User: 1,
	Interaction: 2,
	System: 3,
}

export var TaskRelation = {
	'UNRESTRICTED': '|||',
	'CHOICE': '[]',
	'CONCURRENTINFO': '|[]|',
	'RANDOM': '|=|',
	'DEACT': '[>',
	'ENABLE': '>>',
	'CHOICEINFO': '[]>>',
	'RESUME': '|>',
	'ITERATION': 'T*',
	'OPTIONAL': '[T]',	
}

interface TaskBase {
	parentTaskId: string,
	taskType: string,
	name?: string
}

export class TaskModel extends GenericTree {

	private taskCounter: number;
	name: string;
	description: string;
	taskTree: any;
	simlation: any;
	root: Task;

	constructor() {
		var data = {
			type: TaskType.Abstract,
			name: 'Default',
			id: 'TASK_0',
			relation: null,
			description: 'Default abstract node'
		};		
		var tmp = new Task(data);
		super(tmp);
		this.root = tmp;
		this.taskCounter = 1;
	}

	addTask(options: TaskBase) {
		if (!options.parentTaskId) {
			throw new Error('`parentId` must be provided');
		}

		if (!options.taskType) {
			throw new Error('`type` of task must be provided');
		}

		var parentNode = this.searchNode(options.parentTaskId);
		var newTaskId = 'TASK_' + (this.taskCounter++); //@lk comeup with some naming convention

		var data = {
			type: parseInt(TaskType[options.taskType]) || TaskType.Abstract,
			name: (options.name) || (options.taskType + '_' + this.taskCounter),
			id: newTaskId,
			relation: '',
			description: '',
		};
		this.addNode(parentNode, new Task(data));

		return newTaskId;
	}

	addUpdateRelation(taskId, relation) {
		if (!taskId) {
			throw new Error('`taskId` must be provided');
		}
		if (!TaskRelation[relation.toUpperCase()]) {
			throw new Error('Please provide a valid relation');
		}

		if (taskId instanceof Task) {
			taskId.addRelation(TaskRelation[relation.toUpperCase()]);
		} else {
			taskId = this.searchNode(taskId);
			taskId.addRelation(TaskRelation[relation.toUpperCase()]);
		}
	};


	changeTaskType(taskId, taskType) {
		if (!taskId) {
			throw new Error('`taskId` must be provided');
		}

		if (!taskType) {
			throw new Error('`taskType` of task must be provided');
		}

		console.log(taskId, taskType);

		if (!(taskId instanceof Task)) {
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
	validateStructure() {
		var validationObj = {
			messages: [],
			valid: true,
			warnCount: 0,
			errorCount: 0
		};
		function validateTask(task) {
			if (task.isLeaf() && (task.data.type === TaskType.Abstract)) {
				// console.log('Warning: "' + task.data.name + '" is abstract type. Task should have subtasks.');
				validationObj.messages.push('Warning: Task "' + task.data.name + '" is abstract type. Task should have subtasks.');
				validationObj.warnCount++;
			}

			if (!task.data.relation && (task.getRightSibling() !== null)) {
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

}
