"use strict";
var tree_node_1 = require('./tree-node');
var queue_1 = require('../queue/queue');
var GenericTree = (function () {
    function GenericTree(root) {
        this.root = root;
    }
    GenericTree.prototype.addNode = function (parent, node) {
        if (parent instanceof tree_node_1.TreeNode && node instanceof tree_node_1.TreeNode) {
            parent.addChild(node);
        }
        else {
            throw new Error('both `parent` and `node` must be instance of TreeNode');
        }
    };
    GenericTree.prototype.traverseDF = function (callback) {
        // var foundNode = null;
        (function recursiveDF(currentNode) {
            for (var i = 0; i < currentNode.children.length; i++) {
                recursiveDF(currentNode.children[i]);
            }
            callback(currentNode);
            // console.log(currentNode.layout);
        })(this.root);
    };
    GenericTree.prototype.searchNode = function (searchId) {
        var foundNode = (function recursiveDF(currentNode) {
            if (currentNode.data.id === searchId) {
                return currentNode;
            }
            else {
                var tmp = null;
                for (var i = 0; i < currentNode.children.length; i++) {
                    tmp = recursiveDF(currentNode.children[i]);
                    if (tmp !== null) {
                        return tmp;
                    }
                }
                return null;
            }
        })(this.root);
        return foundNode;
    };
    ;
    GenericTree.prototype.traverseBF = function (callback) {
        var queue = new queue_1.GenericQueue(), currentNode;
        queue.enqueue(this.root);
        currentNode = queue.dequeue();
        // console.log(currentNode);
        callback(currentNode);
        while (currentNode) {
            for (var i = 0; i < currentNode.children.length; i++) {
                queue.enqueue(currentNode.children[i]);
            }
            currentNode = queue.dequeue();
            if (currentNode) {
                // console.log(currentNode.layout);
                callback(currentNode);
            }
        }
    };
    ;
    return GenericTree;
}());
exports.GenericTree = GenericTree;
//# sourceMappingURL=generic-tree.js.map