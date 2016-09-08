import {List, Map} from "immutable";
import {ITask} from "./taskmodel.types";
import {Observable} from "rxjs/Observable";
import {Queue} from "../shared";
/**
 * Functions and algorithms for flat-tree using immutablejs
 */
export class TreeUtils {

  constructor(private nodeList: Map<string, ITask>, private root: string) { }

  traverseDF(callback) {
    (function recursiveDF(node: string) {
      let children: List<string> = this.getChildren(node);
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
        let children: List<string> = this.getChildren(node);
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
      let queue = new Queue<string>(),
        currentNode = this.root;
      observer.next(currentNode);
      while (currentNode) {
        let children: List<string> = this.getChildren(currentNode);
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
    let size = this.nodeList.getIn([node, "children"]).size;
    return size > 0 ? false : true;
  }

  getChildren(node: string) {
    return this.nodeList.getIn([node, "children"]);
  }

  getFirstChild(node: string): string {
    return this.nodeList.getIn([node, "children"]).first();
  }

  getLastChild(node: string): string {
    return this.nodeList.getIn([node, "children"]).last();
  }

  getFirstSibling(node: string): string {
    return this.getFirstChild(this.getParent(node));
  }

  getParent(node: string): string {
    return this.nodeList.getIn([node, "parent"], null);
  }

  isParentOf(node1: string, node2: string): boolean {
    return this.nodeList.getIn([node1, "children"]).has(node2);
  }

  getLeftSibling(node: string): string {
    let parent = this.getParent(node);
    if (parent) {
      let nodeIdx = this.nodeList.getIn([parent, "children"]).indexOf(node);
      if (nodeIdx > 0) {
        return this.nodeList.getIn([parent, "children", nodeIdx - 1]);
      }
    }

    return null;
    // let nodeIdx = this.nodeList.getIn([parent, "children"]).indexOf(node);
    // if (nodeIdx > 0) {
    //   return this.nodeList.getIn([parent, "children"], nodeIdx - 1);
    // } else {
    //   return null;
    // }
  }

  getRightSibling(node: string): string {
    let parent = this.getParent(node);
    if(parent) {
      let childs: List<string> = this.nodeList.getIn([parent, "children"]);
      let nodeIdx = childs.indexOf(node);
      if (childs.size > (nodeIdx + 1)) {
        return this.nodeList.getIn([parent, "children", nodeIdx + 1]);
      }
    }
    return null;
  }

}
