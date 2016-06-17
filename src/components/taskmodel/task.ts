import {TreeNode} from '../generic-tree/tree-node';

export var TaskType = {
  'ABSTRACT': 'Abstract',
  'USER': 'User',
  'INTERACTION': 'Interaction',
  'SYSTEM': 'System',
};

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
};

/**
*	type: type of node(Tasktype)
*	id: unique identifier for a node
*	relation: relation of the node with right sibling if any
*	special: repeat or optional or something else
*	any other data specific to this node
*/
interface TaskData {
  id: string,
  type: string,
  relation: string,
  name: string,
  description: string,
  special?: any
}

export class Task extends TreeNode {
  private _data: TaskData;
  // relation: string;
  children: Task[];
  coord: {
  	x: number,
  	y: number,
  }
  public get id(): string {
    return this._data.id;
  }
  public set id(v: string) {
    if (!this._data || !this._data.id)
      this._data.id = v;
    else
      throw new Error('Cannot change ID of task');
  }

  public get type(): string {
    return this._data.type;
  }

  public set type(v: string) {
    if (!TaskType[v.toUpperCase()])
      throw new Error('Invalid task type');
    else
      this._data.type = v;
  }

  public get relation(): string {
    return this._data.relation;
  }

  public set relation(value: string) {
    // if (this.parent && (this.parent.getLastChild() !== this)) {
      this._data.relation = value;
    // } else {
    //   throw new Error('Cannot add/edit relation no right sibling');
    // }
  }

  public get name() : string {
    return this._data.name;
  }

  public set name(v : string) {
  	if(v && v.length > 0)
  		this._data.name = v;
  	else
  		throw new Error('Invalid name for task');
  }

  public get description() : string {
    return this._data.description;
  }

  public set description(v : string) {
    if (v)
      this._data.description = v;
    else
      this._data.description = '';
  }

  constructor(data: TaskData) {
    super();
    this._data = {
      id: null,
      type: "",
      relation: "",
      name: "",
      description: "",
    };
    this.id = data.id;
    this.type = data.type;
    this.relation = data.relation;
    this.name = data.name;
    this.description = data.description;
  }

}