interface LayoutConfig {
  mod: number;
  x: number;
  change: number;
  shift: number;
  thread: TreeNode;
  ancestor: TreeNode;
}

interface Coord {
  x: number;
  y: number;
}

export class TreeNode {
  parent: TreeNode;
  children: TreeNode[];
  idx: number;
  coord: Coord;
  layout: LayoutConfig;

  constructor() {
    this.parent = null;
    this.children = [];
    this.idx = 0;
    this.coord = {
      x: 0,
      y: 0
    };
    this.layout = {
      mod: 0,
      x: 0,
      change: 0,
      shift: 0,
      thread: null,
      ancestor: null,
    };
  }

  addChild(node) {
    node.idx = this.children.length;
    node.parent = this;
    this.children.push(node);
  };

  getFirstChild() {
    return (this.children.length > 0) ? this.children[0] : null;
  };

  getLastChild() {
    return (this.children.length > 0) ? this.children[this.children.length - 1] : null;
  };

  isLeaf() {
    return (this.children.length > 0) ? false : true;
  };

  getIndex() {
    return this.parent.children.indexOf(this);
  }

  getChildIndex(node) {
    return this.children.indexOf(node);
  };

  getLeftSibling() {
    let idx = this.getIndex();
    return (idx && this.parent) ? this.parent.children[idx - 1] : null;
  }

  getRightSibling() {
    let idx = this.getIndex();
    return (!this.parent || (idx === this.parent.children.length - 1)) ? null : this.parent.children[idx + 1];
  }

  isParentOf(node) {
    return (this.children.indexOf(node) > -1) ? true : false;
  }

  swapChildren(i, j) {
    let tmp = this.children[i];
    this.children[i] = this.children[j];
    this.children[j] = tmp;
  }

  removeChild(child: TreeNode) {
    let idx = this.children.indexOf(child);
    if (idx > -1) {
      this.children.splice(idx, 1);
      return true
    } else {
      return false;
    }
  }

  resetLayoutData() {
    this.layout = {
      mod: 0,
      x: 0,
      change: 0,
      shift: 0,
      thread: null,
      ancestor: null,
    };
  }
}
