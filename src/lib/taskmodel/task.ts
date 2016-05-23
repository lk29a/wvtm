import {TreeNode} from '../generic-tree/tree-node';

/**
*	type: type of node(Tasktype)
*	id: unique identifier for a node
*	relation: relation of the node with right sibling if any
*	special: repeat or optional or something else
*	any other data specific to this node
*/
interface TaskData {
	type: number,
	name: string,
	id: string,
	relation: string,
	description: string,
	special?: any
}

export class Task extends TreeNode {
	children: Task[];
	
	constructor(public data: TaskData) {
		super();
	}

	addRelation(rel: string) {
		if (rel && this.parent && (this.parent.getLastChild() !== this)) {
			this.data.relation = rel;
		} else {
			throw new Error('Cannot add/edit relation no right sibling');
		}
	}	

	editData(data) {
		// this.data = angular.extend({}, this.data, data);
	};


}