/**
 *
 *   Tree layout calculator based on Buchheim et al.'s algorithm  
 *   http://dirk.jivas.de/papers/buchheim02improving.pdf
 * 
 */
import {List, Map} from "immutable";
import {ITask, ICoord} from "./taskmodel.types";
import {TreeUtils} from "./treeutils";
import {RENDERER_DEFAULTS} from "../shared";

export class TreeLayout {
  private bounds: any;
  private layoutData = {};
  private tasks: Map<string, ITask>;
  constructor() {
    this.bounds = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0
    };

  }

  // calculate(rootNode: string, tasks: Map<string, ITask>, centerX = 500): Map<string, ICoord> {
  calculate(rootNode: string, tasks: Map<string, ITask>, centerX = 500): Map<string, ITask> {
    this.tasks = tasks;
    this.layoutData = tasks.map((val) => {
      return {
        mod: 0,
        x: 0,
        change: 0,
        shift: 0,
        thread: null,
        ancestor: null,
      }
    }).toJS();
    this.firstWalk(rootNode);
    this.secondWalk(rootNode, -this.layoutData[rootNode].x, 0.3);
    this.centreLayout(rootNode, centerX);

    tasks = tasks.withMutations((data) => {
      for (let key in this.layoutData) {
        if (this.layoutData.hasOwnProperty(key)) {
          // console.log(data.getIn([key, "coords"])["x"], this.layoutData[key].x);
          if(this.layoutData[key].x !== data.getIn([key, "coords"])["x"]) {
            // console.log(key, "new coords", data.getIn([key, "coords"]), this.layoutData[key]);
            data.setIn([key, "coords"], {
              x: this.layoutData[key].x,
              y: this.layoutData[key].y
            });
          }
        }
      }      
    });
    return tasks;
  }

  private firstWalk(node: string) {
    // set layout data for node
    if (this.isLeaf(node)) {
      let leftSibling = this.getLeftSibling(node);
      if (leftSibling) {
        // set set preliminary x relative to left sibling
        this.layoutData[node].x = this.getX(leftSibling) + this.getDistance();
      } else {
        this.layoutData[node].x = 0;
      }
    } else {
      let defaultAncestor = this.getFirstChild(node);
      let children: List<string> = this.getChildren(node);
      for (let i = 0; i < children.size; i++) {
        this.firstWalk(children.get(i));
        defaultAncestor = this.apportion(children.get(i), defaultAncestor);
      }
      // console.log("finished node = " + node + " children");
      this.executeShifts(node);
      let midPoint = (this.getX(this.getFirstChild(node)) + this.getX(this.getLastChild(node))) / 2;
      let curLeftSibling = this.getLeftSibling(node);
      if (curLeftSibling !== null) {
        this.layoutData[node].x = this.getX(curLeftSibling) + this.getDistance();
        this.layoutData[node].mod = this.getX(node) - midPoint;
      } else {
        this.layoutData[node].x = midPoint;
      }
    }
  }
  private secondWalk(node, m, level) {
    // this.layoutData[node].x += m;
    this.layoutData[node].x = this.layoutData[node].x + m;
    this.layoutData[node].y = RENDERER_DEFAULTS.levelDistance * level;
    if (this.layoutData[node].x < this.bounds.x1)
      this.bounds.x1 = this.layoutData[node].x;

    if (this.layoutData[node].x > this.bounds.x2)
      this.bounds.x2 = this.layoutData[node].x;

    if (this.layoutData[node].y < this.bounds.y1)
      this.bounds.y1 = this.layoutData[node].y;

    if (this.layoutData[node].y > this.bounds.y2)
      this.bounds.y2 = this.layoutData[node].y;


    this.layoutData[node].mod += m;

    let children: List<string> = this.getChildren(node);
    for (let i = 0; i < children.size; i++) {
      // for (let i = 0; i < node.children.length; i++) {
      this.secondWalk(children.get(i), this.getMod(node), level + 1);
    }

    // node.resetLayoutData();
  }

  private centreLayout(root, centre) {
    let shift = 0;
    if (Math.abs(this.bounds.x2 - this.bounds.x1) / 2 > centre) {
      centre = (this.bounds.x2 - this.bounds.x1) / 2;
    }

    if (centre) {
      shift = centre - this.layoutData[root].x;
    } else {
      shift = Math.abs(this.bounds.x1);
    }
    let _this = this;
    (function traverse(node) {
      _this.layoutData[node].x += shift;
      let children: List<string> = _this.getChildren(node);
      for (let i = 0; i < children.size; i++) {
        traverse(children.get(i));
      }
    })(root);
  }

  private apportion(node: string, defaultAncestor: string) {
    let leftSibling = this.getLeftSibling(node);
    if (leftSibling) {
      // I = inner; O = outer; R = right; L = left;
      // shift = shift value for node/subtree 
      let nodeIR, nodeOR, nodeIL, nodeOL, shiftIR, shiftOR, shiftIL, shiftOL;

      nodeIR = nodeOR = node;
      nodeIL = leftSibling;
      nodeOL = this.getFirstSibling(node)

      shiftIR = this.layoutData[nodeIR].mod;
      shiftOR = this.layoutData[nodeOR].mod;
      shiftIL = this.layoutData[nodeIL].mod;
      shiftOL = this.layoutData[nodeOL].mod;

      let nextRightIL = this.nextRight(nodeIL);
      let nextLeftIR = this.nextLeft(nodeIR);

      while (nextRightIL !== null && nextLeftIR !== null) {
        nodeIL = nextRightIL;
        nodeIR = nextLeftIR;
        nodeOL = this.nextLeft(nodeOL);
        nodeOR = this.nextRight(nodeOR);
        this.setAncestor(nodeOR, node);

        let shift = (this.getX(nodeIL) + shiftIL) - (this.getX(nodeIR) + shiftIR) + this.getDistance();
        if (shift > 0) {
          let tmpAncestor = this.ancestor(nodeIL, node, defaultAncestor);
          this.moveSubtree(tmpAncestor, node, shift);
          shiftIR = shiftIR + shift;
          shiftOR = shiftOR + shift;
        }

        shiftIL = shiftIL + this.getMod(nodeIL);
        shiftIR = shiftIR + this.getMod(nodeIR);
        shiftOL = shiftOL + this.getMod(nodeOL);
        shiftOR = shiftOR + this.getMod(nodeOR);

        nextRightIL = this.nextRight(nodeIL);
        nextLeftIR = this.nextLeft(nodeIR);
      }

      if (nextRightIL !== null && this.nextRight(nodeOR) === null) {
        this.setThread(nodeOR, nextRightIL);
        this.layoutData[nodeOR].mod += (shiftIL - shiftOR);
      } else {
        if (nextLeftIR !== null && this.nextLeft(nodeOL) === null) {
          this.setThread(nodeOL, nextLeftIR);
          this.layoutData[nodeOL].mod += (shiftIR - shiftOL);
        }
        defaultAncestor = node;
      }
    }
    return defaultAncestor;
  }

  private moveSubtree(subtreeL, subtreeR, shift) {
    let subtrees = this.getIndex(subtreeR) - this.getIndex(subtreeL);
    // console.log(subtreeL, "is in conflict with", subtreeR, "moving", subtrees, "shift", shift);
    this.layoutData[subtreeR].change -= shift / subtrees;
    this.layoutData[subtreeR].shift += shift;
    this.layoutData[subtreeL].change += shift / subtrees;

    this.layoutData[subtreeR].x += shift;
    this.layoutData[subtreeR].mod += shift;
  }

  private executeShifts(node) {
    let shift = 0,
      change = 0;

    let children: List<string> = this.getChildren(node);
    for (let i = children.size - 1; i >= 0; i--) {
      let child = children.get(i);
      // console.log("shift:", child, "x=", this.layoutData[child].x, "mod=", this.layoutData[child].mod, shift, this.layoutData[child].change);
      this.layoutData[child].x += shift;
      this.layoutData[child].mod += shift;

      change += this.layoutData[child].change;
      shift += this.layoutData[child].shift + change;
    }
  }

  private nextLeft(node) {
    return this.isLeaf(node) ? this.layoutData[node].thread : this.getFirstChild(node);
  }

  private nextRight(node) {
    return this.isLeaf(node) ? this.layoutData[node].thread : this.getLastChild(node);
  }

  private setThread(node, thread) {
    this.layoutData[node].thread = thread;
  }

  private setAncestor(node, ancestor) {
    this.layoutData[node].ancestor = ancestor;
  }

  private ancestor(nodeIL, node, defaultAncestor) {
    if (this.isParentOf(this.getParent(node), this.layoutData[nodeIL].ancestor)) {
      return this.layoutData[nodeIL].ancestor;
    } else {
      return defaultAncestor;
    }
  }

  private getDistance() {
    // @lk return proper distance using node1 and node2      
    return RENDERER_DEFAULTS.nodeDistance + (RENDERER_DEFAULTS.nodeRadius * 2);
  }

  private getMod(node) {
    return (node === null) ? 0 : this.layoutData[node].mod;
  }

  private getX(node) {
    return (node === null) ? 0 : this.layoutData[node].x;
  }

  getIndex(node: string) {
    let parent = this.getParent(node);
    return this.tasks.getIn([parent, "children"]).indexOf(node);
  }

  isLeaf(taskId: string): boolean {
    let size = this.tasks.getIn([taskId, "children"]).size;
    return size > 0 ? false : true;
  }

  getChildren(node: string) {
    return this.tasks.getIn([node, "children"]);
  }

  getFirstChild(taskId: string) {
    return this.tasks.getIn([taskId, "children"]).first();
  }

  getLastChild(taskId: string) {
    return this.tasks.getIn([taskId, "children"]).last();
  }

  getFirstSibling(taskId: string) {
    return this.getFirstChild(this.getParent(taskId));
  }

  getParent(taskId: string) {
    return this.tasks.getIn([taskId, "parent"]);
  }

  isParentOf(node1: string, node2: string) {
    return this.tasks.getIn([node1, "children"]).has(node2);
  }

  getLeftSibling(taskId: string): string {
    let parent = this.getParent(taskId);
    if (parent) {
      let taskIdx = this.tasks.getIn([parent, "children"]).indexOf(taskId);
      if (taskIdx > 0) {
        return this.tasks.getIn([parent, "children", taskIdx - 1]);
      }
    }

    return null;
    // let taskIdx = this.tasks.getIn([parent, "children"]).indexOf(taskId);
    // if (taskIdx > 0) {
    //   return this.tasks.getIn([parent, "children"], taskIdx - 1);
    // } else {
    //   return null;
    // }
  }

  getRightSibling(taskId: string): string {
    let parent = this.getParent(taskId);
    let childs: List<string> = this.tasks.getIn([parent, "children"]);
    let taskIdx = childs.indexOf(taskId);
    if (childs.size > (taskIdx + 1)) {
      return this.tasks.getIn([parent, "children", taskIdx + 1]);
    } else {
      return null;
    }
  }
}
