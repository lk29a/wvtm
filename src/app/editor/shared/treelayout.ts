/**
 *
 *   Tree layout calculator based on Buchheim et al.'s algorithm  
 *   http://dirk.jivas.de/papers/buchheim02improving.pdf
 * 
 */
import { Injectable } from "@angular/core";
import {RENDERER_DEFAULTS} from "../../shared";

@Injectable()
export class TreeLayout {
  private bounds: any;

  constructor() {
    this.bounds = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0
    };

  }

  calculate(root, centerX) {
    this.firstWalk(root);
    this.secondWalk(root, -root.layout.x, 0.3);
    this.centreLayout(root, centerX);
  }

  private firstWalk(node) {
    if (node.isLeaf()) {
      let leftSibling = node.getLeftSibling();
      if (leftSibling) {
        // set set preliminary x relative to left sibling
        node.layout.x = this.getX(leftSibling) + this.getDistance();
      } else {
        node.layout.x = 0;
      }
    } else {
      let defaultAncestor = node.getFirstChild();

      for (let i = 0; i < node.children.length; i++) {
        this.firstWalk(node.children[i]);
        defaultAncestor = this.apportion(node.children[i], defaultAncestor);
      }
      this.executeShifts(node);
      let midPoint = (this.getX(node.getFirstChild()) + this.getX(node.getLastChild())) / 2;
      let curLeftSibling = node.getLeftSibling();
      if (curLeftSibling !== null) {
        node.layout.x = this.getX(curLeftSibling) + this.getDistance();
        node.layout.mod = this.getX(node) - midPoint;
      } else {
        node.layout.x = midPoint;
      }
    }
  }

  private secondWalk(node, m, level) {
    // node.layout.x += m;
    node.coord.x = node.layout.x + m;
    node.coord.y = RENDERER_DEFAULTS.levelDistance * level;
    if (node.coord.x < this.bounds.x1)
      this.bounds.x1 = node.coord.x;

    if (node.coord.x > this.bounds.x2)
      this.bounds.x2 = node.coord.x;

    if (node.coord.y < this.bounds.y1)
      this.bounds.y1 = node.coord.y;

    if (node.coord.y > this.bounds.y2)
      this.bounds.y2 = node.coord.y;


    node.layout.mod += m;

    for (let i = 0; i < node.children.length; i++) {
      this.secondWalk(node.children[i], this.getMod(node), level + 1);
    }

    node.resetLayoutData();
  }

  private centreLayout(root, centre) {
    let shift = 0;
    if (Math.abs(this.bounds.x2 - this.bounds.x1) / 2 > centre) {
      centre = (this.bounds.x2 - this.bounds.x1) / 2;
    }

    if (centre) {
      shift = centre - root.coord.x;
    } else {
      shift = Math.abs(this.bounds.x1);
    }

    (function traverse(node) {
      node.coord.x += shift;
      for (let i = 0; i < node.children.length; i++) {
        traverse(node.children[i]);
      }
    })(root);
  }

  private apportion(node, defaultAncestor) {
    let leftSibling = node.getLeftSibling();
    if (leftSibling) {
      // I = inner; O = outer; R = right; L = left;
      // shift = shift value for node/subtree 
      let nodeIR, nodeOR, nodeIL, nodeOL, shiftIR, shiftOR, shiftIL, shiftOL;

      nodeIR = nodeOR = node;
      nodeIL = leftSibling;
      nodeOL = node.parent.getFirstChild();

      shiftIR = nodeIR.layout.mod;
      shiftOR = nodeOR.layout.mod;
      shiftIL = nodeIL.layout.mod;
      shiftOL = nodeOL.layout.mod;

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
        if (nodeOL) {
          shiftOL = shiftOL + this.getMod(nodeOL);
        }
        shiftOR = shiftOR + this.getMod(nodeOR);

        nextRightIL = this.nextRight(nodeIL);
        nextLeftIR = this.nextLeft(nodeIR);
      }

      if (nextRightIL !== null && this.nextRight(nodeOR) === null) {
        this.setThread(nodeOR, nextRightIL);
        nodeOR.layout.mod += (shiftIL - shiftOR);
      }

      if (nextLeftIR !== null && this.nextLeft(nodeOL) === null) {
        this.setThread(nodeOL, nextLeftIR);
        nodeOL.layout.mod += (shiftIR - shiftOL);
        defaultAncestor = node;
      }
    }

    return defaultAncestor;
  }

  private moveSubtree(subtreeL, subtreeR, shift) {
    // let subtrees = subtreeR.idx - subtreeL.idx;
    let subtrees = subtreeR.getIndex() - subtreeL.getIndex();
    subtreeR.layout.change -= shift / subtrees;
    subtreeR.layout.shift += shift;
    subtreeL.layout.change += shift / subtrees;

    subtreeR.layout.x += shift;
    subtreeR.layout.mod += shift;
  }

  private executeShifts(node) {
    let shift = 0,
      change = 0;

    for (let i = node.children.length - 1; i >= 0; i--) {
      let child = node.children[i];
      child.layout.x += shift;
      child.layout.mod += shift;

      change += child.layout.change;
      shift += child.layout.shift + change;
    }
  }

  private nextLeft(node) {
    return node.isLeaf() ? node.layout.thread : node.getFirstChild();
  }

  private nextRight(node) {
    return node.isLeaf() ? node.layout.thread : node.getLastChild();
  }

  private setThread(node, thread) {
    node.layout.thread = thread;
  }

  private setAncestor(node, ancestor) {
    node.layout.ancestor = ancestor;
  }

  private ancestor(nodeIL, node, defaultAncestor) {
    if (node.parent.isParentOf(nodeIL.layout.ancestor)) {
      return nodeIL.layout.ancestor;
    } else {
      return defaultAncestor;
    }
  }

  private getDistance() {
    // @lk return proper distance using node1 and node2      
    return RENDERER_DEFAULTS.nodeDistance + (RENDERER_DEFAULTS.nodeRadius * 2);
  }

  private getMod(node) {
    return (node === null) ? 0 : node.layout.mod;
  }

  private getX(node) {
    return (node === null) ? 0 : node.layout.x;
  }
}