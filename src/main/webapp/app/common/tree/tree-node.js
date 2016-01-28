(function(){
	'use strict';

	angular.module('WVTM.tree')
	// .factory('TreeNode', 'TreeNode');
	.factory('TreeNode', function() {
		return TreeNode;		
	});

	function TreeNode(data){
		/**
		* data must contain:
		*	type(int) = type of node(Tasktype)
		*	id(string) = unique identifier for a node
		*	relation = relation of the node with right sibling if any
		*	special = repeat or optional or something else
		*	any other data specific to this node
		*/
		this.data = data;
		this.parent = null;
		this.children = [];
		this.idx = 0;
		this.relation = null;
		this.coord = {
			x: 0,
			y: 0
		};
		/*
		*	mod: x position right shift for a node/subtree
		*	thread: next node in contour
		*	prelim: preliminary x position
		*	ancestor: greatest distinct ancestor of this node and right its neighbour
		*	change: change from original position
		*	shift: how much to shift the subtree
		*/
		this.layout = {
			mod: 0,
			x: 0,
			change: 0,
			shift: 0,
			thread: null,
			ancestor: null,
		};		
	}

	TreeNode.prototype.addChild = function(node) {
		node.idx = this.children.length;
		node.parent = this;
		this.children.push(node);
	};

	TreeNode.prototype.getFirstChild = function() {
		return (this.children.length > 0) ? this.children[0] : null;
	};

	TreeNode.prototype.getLastChild = function() {
		return (this.children.length > 0) ? this.children[this.children.length - 1] : null;
	};

	TreeNode.prototype.isLeaf = function() {
		return (this.children.length > 0) ? false : true;
	};

	TreeNode.prototype.getChildIndex = function(node) {
		return this.children.indexOf(node);
	};

	TreeNode.prototype.getLeftSibling = function() {

		return (this.idx && this.parent) ? this.parent.children[this.idx - 1] : null;

		// var idx = this.parent.getChildIndex(this);
		// if(idx <= 0) {
		// 	return null;
		// } else {
		// 	return this.parent.children[idx-1];
		// }
	};

	TreeNode.prototype.getRightSibling = function() {
		return (!this.parent || (this.idx === this.parent.children.length-1)) ? null : this.parent.children[this.idx + 1];
	};

	TreeNode.prototype.addRelation = function(rel) {
		if(rel && (this.parent.getLastChild() !== this)) {
			this.data.relation = rel;
		} else {
			console.log('Cannot add/edit relation no right sibling');
		}
	};

	TreeNode.prototype.isParentOf = function(node) {
		return (this.children.indexOf(node) > -1) ? true : false;
	};

	TreeNode.prototype.swapChildren = function(i, j) {
		var tmp = this.children[i];
		this.children[i] = this.children[j];
		this.children[j] = tmp;
	};

	TreeNode.prototype.removeChild = function(idx) {
		//@lk change to reflect idx property
		this.children.splice(idx, 1);
	};

	TreeNode.prototype.editData = function(data) {
		this.data = angular.extend({}, this.data, data);
	};

	TreeNode.prototype.resetLayoutData = function() {
		this.layout = {
			mod: 0,
			x: 0,
			change: 0,
			shift: 0,
			thread: null,
			ancestor: null,
		};	
	};


})();
