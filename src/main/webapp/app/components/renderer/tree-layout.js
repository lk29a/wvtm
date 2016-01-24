/**
 *
 * 	Tree layout calculator based on Buchheim et al.'s algorithm  
 *		http://dirk.jivas.de/papers/buchheim02improving.pdf
 * 
 */

(function() {
  'use strict';

  angular.module('WVTM.renderer')
    .factory('TreeLayout', TreeLayout);

  // TaskModelLayout.$inject = [];
  function TreeLayout() {

    var CONST = {
      nodeDistance: 70,
      levelDistance: 100,
      nodeRadius: 20
    },
    localTree = null,
    //shift whole tree by x if its negative
    bounds = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0
    };
    var api = {
      calculate: calculate,
      update: update
    };

    return api;


    /********************/

    function calculate(root, centre) {
      // var tree = angular.copy(taskModel.tree);
      // localTree = tree;
      bounds = {
        x1: 0,
        x2: 0,
      };
      firstWalk(root);
      secondWalk(root, -root.layout.x, 1);

      centreLayout(root, centre);
    }

    /**
     *	Heart of the algorithm 
     *
     */
    function apportion(node, defaultAncestor) {
      var leftSibling = node.getLeftSibling();
      if (leftSibling) {
        //I = inner; O = outer; R = right; L = left;
        //shift = shift value for node/subtree 
        var nodeIR, nodeOR, nodeIL, nodeOL, shiftIR, shiftOR, shiftIL, shiftOL;

        nodeIR = nodeOR = node;
        nodeIL = leftSibling;
        nodeOL = node.parent.getFirstChild();

        shiftIR = nodeIR.layout.mod;
        shiftOR = nodeOR.layout.mod;
        shiftIL = nodeIL.layout.mod;
        shiftOL = nodeOL.layout.mod;

        var nextRightIL = nextRight(nodeIL);
        var nextLeftIR = nextLeft(nodeIR);

        while (nextRightIL !== null && nextLeftIR !== null) {
          nodeIL = nextRightIL;
          nodeIR = nextLeftIR;
          nodeOL = nextLeft(nodeOL);
          nodeOR = nextRight(nodeOR);
          setAncestor(nodeOR, node);

          var shift = (getX(nodeIL) + shiftIL) - (getX(nodeIR) + shiftIR) + getDistance(nodeIL, nodeIR);
          if (shift > 0) {
            var tmpAncestor = ancestor(nodeIL, node, defaultAncestor);
            moveSubtree(tmpAncestor, node, shift);
            shiftIR = shiftIR + shift;
            shiftOR = shiftOR + shift;
          }

          shiftIL = shiftIL + getMod(nodeIL);
          shiftIR = shiftIR + getMod(nodeIR);
          if (nodeOL) {
            shiftOL = shiftOL + getMod(nodeOL);
          }
          shiftOR = shiftOR + getMod(nodeOR);

          nextRightIL = nextRight(nodeIL);
          nextLeftIR = nextLeft(nodeIR);
        }

        if (nextRightIL !== null && nextRight(nodeOR) === null) {
          setThread(nodeOR, nextRightIL);
          nodeOR.layout.mod += (shiftIL - shiftOR);
        }

        if (nextLeftIR !== null && nextLeft(nodeOL) === null) {
          setThread(nodeOL, nextLeftIR);
          nodeOL.layout.mod += (shiftIR - shiftOL);
          defaultAncestor = node;
        }
      }

      return defaultAncestor;
    }


    function firstWalk(node) {
      if (node.isLeaf()) {
        var leftSibling = node.getLeftSibling();
        if (leftSibling) {
          //set set preliminary x relative to left sibling
          node.layout.x = getX(leftSibling) + getDistance();
        } else {
          node.layout.x = 0;
        }
      } else {
        var defaultAncestor = node.getFirstChild();

        for (var i = 0; i < node.children.length; i++) {
          firstWalk(node.children[i]);
          defaultAncestor = apportion(node.children[i], defaultAncestor);
        }
        executeShifts(node);
        var midPoint = (getX(node.getFirstChild()) + getX(node.getLastChild())) / 2;
        var curLeftSibling = node.getLeftSibling();
        if (curLeftSibling !== null) {
          node.layout.x = getX(curLeftSibling) + getDistance();
          node.layout.mod = getX(node) - midPoint;
        } else {
          node.layout.x = midPoint;
        }
      }

      // console.log(node.data);
      // console.log(node.layout);

    }

    function secondWalk(node, m, level) {
      // node.layout.x += m;
      node.coord.x = node.layout.x + m;
      if (node.coord.x < bounds.x1) {
        bounds.x1 = node.coord.x;
      }
      if (node.coord.x > bounds.x2) {
        bounds.x2 = node.coord.x;
      }
      node.layout.mod += m;
      node.coord.y = CONST.levelDistance * level;

      for (var i = 0; i < node.children.length; i++) {
        secondWalk(node.children[i], getMod(node), level + 1);
      }

      node.resetLayoutData();
    }

    function centreLayout(root, centre) {
      var shift = 0;
      if(Math.abs(bounds.x2 - bounds.x1)/2 > centre) {
        centre = (bounds.x2 - bounds.x1)/2;
      }

      if(centre) {
        shift = centre - root.coord.x;
      }  else {
        shift = Math.abs(bounds.x1);
      }     

      (function traverse(node) {
        node.coord.x += shift;
        for (var i = 0; i < node.children.length; i++) {
          traverse(node.children[i]);
        }
      })(root);
    }

    function moveSubtree(subtreeL, subtreeR, shift) {
      var subtrees = subtreeR.idx - subtreeL.idx;
      subtreeR.layout.change -= shift / subtrees;
      subtreeR.layout.shift += shift;
      subtreeL.layout.change += shift / subtrees;

      subtreeR.layout.x += shift;
      subtreeR.layout.mod += shift;
    }

    function executeShifts(node) {
      var shift = 0,
        change = 0;

      for (var i = node.children.length - 1; i >= 0; i--) {
        var child = node.children[i];
        child.layout.x += shift;
        child.layout.mod += shift;

        change += child.layout.change;
        shift += child.layout.shift + change;
      }
    }

    function nextLeft(node) {
      return node.isLeaf() ? node.layout.thread : node.getFirstChild();
    }

    function nextRight(node) {
      return node.isLeaf() ? node.layout.thread : node.getLastChild();
    }

    function setThread(node, thread) {
      node.layout.thread = thread;
    }

    function setAncestor(node, ancestor) {
      node.layout.ancestor = ancestor;
    }

    function ancestor(nodeIL, node, defaultAncestor) {
      if (node.parent.isParentOf(nodeIL.layout.ancestor)) {
        return nodeIL.layout.ancestor;
      } else {
        return defaultAncestor;
      }
    }

    function getDistance(node1, node2) {
      //@lk return proper distance using node1 and node2			
      return CONST.nodeDistance + (CONST.nodeRadius * 2);
    }

    function getMod(node) {
      return (node === null) ? 0 : node.layout.mod;
    }

    function getX(node) {
      return (node === null) ? 0 : node.layout.x;
    }


    /**
     *	Update only part of layout
     *	Decide which side to move left/right - path to root then check index of child
     * process only part of tree and update x coordinates
     *	handling parent? 
     **/
    function update(subTree, tree) {
      //determine left or right
      var moveDir = 'l',
        prev = subTree,
        root = subTree,
      	level = 0;

    	adjustX = 0;

      while (root.parent) {
        prev = root;
        root = root.parent;
        level++;
      }


      //set initial x for new child
      var newChild = subTree.getLastChild();
      var lbro = newChild.getLeftSibling();

      var tmpc = {
      	x: (!lbro) ? newChild.parent.coord.x : lbro.coord.x - getDistance(),
      	y: (level + 2)* CONST.levelDistance
      };

      // newChild.coord.x = lbro.coord.x - getDistance();
      // newChild.coord.y = (level + 2)* CONST.levelDistance;

      var subTreeIdx = root.getChildIndex(prev);
      if (subTreeIdx < (root.children.length + 1) / 2) {
        //left
        moveDir = 'l';
      } else {
        //right
        moveDir = 'r';
      }


      tree.traverseBF(function(node) {
        console.log(node.data.name, node.coord);
      });
      console.log('before');

      shiftSubtree(root, subTreeIdx, tree, moveDir);

      console.log('after');
      tree.traverseBF(function(node) {
        console.log(node.data.name, node.coord);
      });
      newChild.coord.x = tmpc.x + getDistance();
      newChild.coord.y = tmpc.y;

      if (adjustX < 0) {
        shiftLayoutX(tree.root);
      }
    }


    function shiftSubtree(root, idx, tree, dir) {
    	debugger;
      console.log(idx);

      //semi-firstwalk
      (function first(node, idx) {
      	if(dir === 'r') {
	        node.layout.x = node.coord.x;
      	} else {
	        node.layout.x = node.coord.x - getDistance();
      	}

        if (!node.isLeaf()) {
          var numChilds = node.parent ? node.children.length : (idx + 1),
          i = node.parent ? 0 : idx;

          for (i; i < numChilds; i++) {
            first(node.children[i]);
          }
          // executeShifts(node);
          var midPoint = (node.getFirstChild().coord.x + node.getLastChild().coord.x) / 2;
          var curLeftSibling = node.getLeftSibling();
          if (curLeftSibling !== null) {

	      	if(dir === 'r') {
            node.layout.x = getX(curLeftSibling) + getDistance();
            node.layout.mod = getX(node) - midPoint;
	      	} else {
            node.layout.x = getX(curLeftSibling) + getDistance();
            node.layout.mod = getX(node) - midPoint;
	      	}

          } else {
            node.layout.x = midPoint;
          }

        console.log(node.layout);

        }
      })(tree.root, idx);

      tree.traverseBF(function(node) {
        console.log(node.data.name, node.layout);
      });

console.log('second');
      // // second walk
      (function second(node, m, level, idx) {
        console.log(node.data.name, node.layout);
        node.coord.x = node.layout.x + m;
        if (node.coord.x < adjustX) {
          adjustX = node.coord.x;
        }
        node.layout.mod += m;
        node.coord.y = CONST.levelDistance * level;
        var numChilds = node.parent ? node.children.length : (idx + 1),
        i = node.parent ? 0 : idx;
        for (i; i < numChilds; i++) {
          second(node.children[i], getMod(node), level + 1);
        }

        node.resetLayoutData();
      })(tree.root, -tree.root.layout.mod, 1, idx);


    }

  }
})();
