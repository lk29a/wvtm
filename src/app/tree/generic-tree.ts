import { TreeNode, Queue } from "./index";

interface LayoutBounds {
  x1: number,
  y1: number,
  x2: number,
  y2: number
}

export class GenericTree {
  bounds: LayoutBounds;

  constructor(public root: TreeNode) {
  }

  addNode(parent: TreeNode, node: TreeNode) {
    if (parent instanceof TreeNode && node instanceof TreeNode) {
      parent.addChild(node);
    } else {
      throw new Error("both `parent` and `node` must be instance of TreeNode");
    }
  }

  traverseDF(callback) {
    // var foundNode = null;
    (function recursiveDF(currentNode) {
      for (let i = 0; i < currentNode.children.length; i++) {
        recursiveDF(currentNode.children[i]);
      }
      callback(currentNode);
      // console.log(currentNode.layout);
    })(this.root);

  }

  traverseBF(callback) {
    let queue = new Queue(),
      currentNode;

    queue.enqueue(this.root);
    currentNode = queue.dequeue();
    // console.log(currentNode);
    callback(currentNode);

    while (currentNode) {
      for (let i = 0; i < currentNode.children.length; i++) {
        queue.enqueue(currentNode.children[i]);
      }

      currentNode = queue.dequeue();
      if (currentNode) {
        // console.log(currentNode.layout);
        callback(currentNode);
      }
    }
  };


}