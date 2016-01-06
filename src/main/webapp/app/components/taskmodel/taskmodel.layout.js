/**
*
* 	Tree layout calculator based on Buchheim et al.'s algorithm  
*		http://dirk.jivas.de/papers/buchheim02improving.pdf
* 
*/

(function(){
	'use strict';

	angular.module('WVTM.TaskModel')
	.factory('TaskModelLayout', TaskModelLayout);

	// TaskModelLayout.$inject = [];
	function TaskModelLayout(){

		var CONST = {
			nodeDistance: 120,
			levelDistance: 100,
			nodeRadius: 20
		};

		var api = {
			calculate: calculate
		};

		return api;


		/********************/

		function calculate(taskModel) {
			// var tree = angular.copy(taskModel.tree);
			firstWalk(taskModel.tree.root);
			secondWalk(taskModel.tree.root, 75, 1);

		}

		/**
		*	Heart of the algorithm 
		*
		*/
		function apportion(node, defaultAncestor) {
			var leftSibling = node.getLeftSibling();
			if(leftSibling) {
				//I = inner; O = outer; R = right; L = left;
				//shift = shift value for node/subtree 
				var nodeIR, nodeOR, nodeIL, nodeOL, shiftIR, shiftOR, shiftIL, shiftOL;

				nodeIR = nodeOR = node;
				nodeIL = leftSibling;
				nodeOL = node.parent.getFirstChild();
				shiftIR = shiftOR = node.layout.mod;
				shiftIL = nodeIL.layout.mod;
				shiftOL = nodeOL.layout.mod;

				var nextRightIL = nextRight(nodeIL);
				var nextLeftIR = nextRight(nodeIR);

				while(nextRightIL !== null && nextLeftIR !== null) {
					nodeIL = nextRightIL;
					nodeIR = nextLeftIR;
					nodeOL = nextLeft(nodeOL);
					nodeOR = nextRight(nodeOR);
					setAncestor(nodeOR, node);

					var shift = (getX(nodeIL) + shiftIL) - (getX(nodeIR) + shiftIR) + getDistance(nodeIL, nodeIR);
					if(shift > 0) {
						var tmpAncestor = ancestor(nodeIL, node, defaultAncestor);
						moveSubtree(tmpAncestor, node, shift);
						shiftIR = shiftIR + shift; 
						shiftOR = shiftOR + shift;
					}

					shiftIL = shiftIL + getMod(nodeIL);
					shiftIR = shiftIR + getMod(nodeIR);
					if(nodeOL) {
						shiftOL = shiftOL + getMod(nodeOL);
					}
					shiftOR = shiftOR + getMod(nodeOR);

					nextRightIL = nextRight(nodeIL);
					nextLeftIR = nextRight(nodeIR);
				}

				if(nextRightIL !== null && nextRight(nodeOR) === null) {
					setThread(nodeOR, nextRightIL);
					nodeOR.layout.mod += (shiftIL - shiftOR);
				}

				if(nextLeftIR !== null && nextLeft(nodeOL) === null) {
					setThread(nodeOL, nextLeftIR);
					nodeOL.layout.mod += (shiftIR - shiftOL);
					defaultAncestor = node;
				}
			}

			return defaultAncestor;
		}


		function firstWalk(node) {
			if(node.isLeaf()) {
				var leftSibling = node.getLeftSibling();
				if(leftSibling) {
					//set set preliminary x relative to left sibling
					node.layout.x = getX(leftSibling) + getDistance();
				} else {
					node.layout.x = 0;
				}
			} else{
				var defaultAncestor = node.getFirstChild();

				for (var i = 0; i < node.children.length; i++) {
					firstWalk(node.children[i]);
					defaultAncestor = apportion(node.children[i], defaultAncestor);
				}
				executeShifts(node);
				var	midPoint = (getX(node.getFirstChild()) + getX(node.getLastChild())) / 2;
				var curLeftSibling = node.getLeftSibling();
				if(curLeftSibling !== null) {
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
			node.layout.x += m;
			node.layout.y = CONST.levelDistance * level;
			for (var i = 0; i < node.children.length; i++) {
				secondWalk(node.children[i], m + getMod(node), level+1);
			}
		}

		function moveSubtree(subtreeL, subtreeR, shift) {
			var subtrees = subtreeR.idx - subtreeL.idx;
			subtreeR.layout.change -= shift / subtrees;
			subtreeR.layout.shift += shift;
			subtreeL.layout.change -= shift / subtrees;

			subtreeR.layout.x += shift;
			subtreeR.layout.mod +=  shift;
		}

		function executeShifts(node) {
			var shift = 0,
					change = 0;

			for (var i = node.children.length - 1; i >= 0; i--) {
				var child = node.children[i];
				child.layout.x += shift;
				child.layout.mod += shift;

				change += child.layout.change;
				shift +=  child.layout.shift + change;
			}
		}

		function nextLeft(node) {
			return node.isLeaf() ? node.layout.thread : node.getFirstChild();
		}

		function nextRight(node) {
			return node.isLeaf() ? node.layout.thread : node.getLastChild();
		}

		function setThread(node, thread) {
			node.thread = thread;
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

	}
})();