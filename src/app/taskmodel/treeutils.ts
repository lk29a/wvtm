import {List, Map} from 'immutable';
import {ITask} from './taskmodel.types';
import {Observable} from 'rxjs/Observable';
import {Queue} from '../shared';

/**
 * Functions and algorithms for flat-tree using immutablejs
 */
export class TreeUtils {

  constructor(private nodes: Map<string, ITask>, private root: string) {
  }

  getRealNode(nodeId: string) {
    return this.nodes.get(nodeId);
  }

  traverseDF(callback) {
    (function recursiveDF(node: string) {
      const children: List<string> = this.getChildren(node);
      for (let i = 0; i < children.size; i++) {
        recursiveDF.call(this, children.get(i));
      }
      callback(node);
      // recursiveDF()
    }).call(this, this.root);
  }

  traverseDFObs(): Observable<string> {
    return Observable.create(observer => {
      (function recursiveDF(node: string) {
        const children: List<string> = this.getChildren(node);
        for (let i = 0; i < children.size; i++) {
          recursiveDF.call(this, children.get(i));
        }
        observer.next(node);
        // recursiveDF()
      }).call(this, this.root);
      observer.complete();
    });
  }

  traverseBF(): Observable<string> {
    return Observable.create(observer => {
      const queue = new Queue<string>();
      let currentNode = this.root;
      observer.next(currentNode);
      while (currentNode) {
        const children: List<string> = this.getChildren(currentNode);
        for (let i = 0; i < children.size; i++) {
          queue.enqueue(children.get(i));
        }
        currentNode = queue.dequeue();
        if (currentNode) {
          observer.next(currentNode);
        }
      }
      observer.complete();
    });
  }

  isLeaf(node: string): boolean {
    const size = this.nodes.getIn([node, 'children']).size;
    return size <= 0;
  }

  getChildren(node: string) {
    return this.nodes.getIn([node, 'children']);
  }

  getFirstChild(node: string, getNode?: boolean): any {
    let nodeId = this.nodes.getIn([node, 'children']).first();
    if (getNode) {
      return this.nodes.get(nodeId);
    }
    return nodeId;
  }

  getLastChild(node: string, getNode?: boolean): any {
    const nodeId = this.nodes.getIn([node, 'children']).last();
    if (getNode) {
      return this.nodes.get(nodeId);
    }
    return nodeId;
  }

  getFirstSibling(node: string, getNode?: boolean): any {
    let nodeId = this.getFirstChild(this.getParent(node));
    if (getNode) {
      return this.nodes.get(nodeId);
    }
    return nodeId;
  }

  getParent(node: string, getNode?: boolean): any {
    const nodeId = this.nodes.getIn([node, 'parent'], null);
    if (getNode) {
      return this.nodes.get(nodeId);
    }
    return nodeId;
  }

  isParentOf(node1: string, node2: string): boolean {
    return this.nodes.getIn([node1, 'children']).has(node2);
  }

  getIndex(node: string) {
    const parent = this.getParent(node);
    return this.nodes.getIn([parent, 'children']).indexOf(node);
  }

  getLeftSibling(node: string, getNode?: boolean): any {
    const parent = this.getParent(node);
    if (parent) {
      const nodeIdx = this.nodes.getIn([parent, 'children']).indexOf(node);
      if (nodeIdx > 0) {
        const nodeId = this.nodes.getIn([parent, 'children', nodeIdx - 1]);
        if (getNode) {
          return this.nodes.get(nodeId);
        }
        return nodeId;
      }
    }
    return null;
  }

  getRightSibling(node: string, getNode?: boolean): any {
    const parent = this.getParent(node);
    if (parent) {
      const children: List<string> = this.nodes.getIn([parent, 'children']);
      const nodeIdx = children.indexOf(node);
      if (children.size > (nodeIdx + 1)) {
        const nodeId = this.nodes.getIn([parent, 'children', nodeIdx + 1]);
        if (getNode) {
          return this.nodes.get(nodeId);
        }
        return nodeId;
      }
    }
    return null;
  }
}
