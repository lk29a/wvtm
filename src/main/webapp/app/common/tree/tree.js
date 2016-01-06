/**
 * tarkk.tree Module
 *
 * Basic tree implementation
 */
(function() {
  'use strict';

  angular.module('WVTM.tree', [
      'WVTM.queue'
    ])
    .factory('GenericTree', ['TreeNode', 'Queue', function(TreeNode, Queue) {

      function GenericTree(data) {
        this.root = new TreeNode(data);
        this.layoutBounds = {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 0
        };
      }

      GenericTree.prototype.addNode = function(node, dataOrNode) {
        if (!(node instanceof TreeNode)) {
          // currentNode = root;
          throw new Error('`node` must be an instance of TreeNode');
        }
        if (dataOrNode instanceof TreeNode) {
          node.addChild(dataOrNode);
        } else {
          node.addChild(new TreeNode(dataOrNode));
        }
      };

      GenericTree.prototype.traverseDF = function(callback) {
        // var foundNode = null;
        (function recursiveDF(currentNode) {
          for (var i = 0; i < currentNode.children.length; i++) {
            recursiveDF(currentNode.children[i]);
          }
          callback(currentNode);
          // console.log(currentNode.layout);
        })(this.root);

      };


      GenericTree.prototype.searchNode = function(searchId) {
        var foundNode = (function recursiveDF(currentNode) {
          if (currentNode.data.id === searchId) {
            return currentNode;
          } else {
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


      GenericTree.prototype.traverseBF = function(callback) {
        var queue = new Queue(),
          currentNode;

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
      
      return GenericTree;
    }]);


  // function testTree() {
  //   createNew('one');

  //   root.addChild(new TreeNode('two'));
  //   root.addChild(new TreeNode('three'));
  //   root.addChild(new TreeNode('four'));

  //   root.children[0].addChild(new TreeNode('five'));
  //   root.children[0].addChild(new TreeNode('six'));

  //   root.children[2].addChild(new TreeNode('seven'));

  //   console.log('==========BF==========');
  //   findNodeByIdBF();      
  //   console.log('==========DF==========');
  //   findNodeByIdDF();      
  // }

})();
