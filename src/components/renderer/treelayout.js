"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 *
 *   Tree layout calculator based on Buchheim et al.'s algorithm
 *   http://dirk.jivas.de/papers/buchheim02improving.pdf
 *
 */
var core_1 = require('@angular/core');
var constants_1 = require('../common/constants');
var TreeLayout = (function () {
    function TreeLayout() {
        this.bounds = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };
    }
    TreeLayout.prototype.calculate = function (root, centerX) {
        this.firstWalk(root);
        this.secondWalk(root, -root.layout.x, 0.3);
        this.centreLayout(root, centerX);
    };
    TreeLayout.prototype.firstWalk = function (node) {
        if (node.isLeaf()) {
            var leftSibling = node.getLeftSibling();
            if (leftSibling) {
                //set set preliminary x relative to left sibling
                node.layout.x = this.getX(leftSibling) + this.getDistance();
            }
            else {
                node.layout.x = 0;
            }
        }
        else {
            var defaultAncestor = node.getFirstChild();
            for (var i = 0; i < node.children.length; i++) {
                this.firstWalk(node.children[i]);
                defaultAncestor = this.apportion(node.children[i], defaultAncestor);
            }
            this.executeShifts(node);
            var midPoint = (this.getX(node.getFirstChild()) + this.getX(node.getLastChild())) / 2;
            var curLeftSibling = node.getLeftSibling();
            if (curLeftSibling !== null) {
                node.layout.x = this.getX(curLeftSibling) + this.getDistance();
                node.layout.mod = this.getX(node) - midPoint;
            }
            else {
                node.layout.x = midPoint;
            }
        }
    };
    TreeLayout.prototype.secondWalk = function (node, m, level) {
        // node.layout.x += m;
        node.coord.x = node.layout.x + m;
        if (node.coord.x < this.bounds.x1) {
            this.bounds.x1 = node.coord.x;
        }
        if (node.coord.x > this.bounds.x2) {
            this.bounds.x2 = node.coord.x;
        }
        node.layout.mod += m;
        node.coord.y = constants_1.TREE_LAYOUT_DEFAULTS.levelDistance * level;
        for (var i = 0; i < node.children.length; i++) {
            this.secondWalk(node.children[i], this.getMod(node), level + 1);
        }
        node.resetLayoutData();
    };
    TreeLayout.prototype.centreLayout = function (root, centre) {
        var shift = 0;
        if (Math.abs(this.bounds.x2 - this.bounds.x1) / 2 > centre) {
            centre = (this.bounds.x2 - this.bounds.x1) / 2;
        }
        if (centre) {
            shift = centre - root.coord.x;
        }
        else {
            shift = Math.abs(this.bounds.x1);
        }
        (function traverse(node) {
            node.coord.x += shift;
            for (var i = 0; i < node.children.length; i++) {
                traverse(node.children[i]);
            }
        })(root);
    };
    TreeLayout.prototype.apportion = function (node, defaultAncestor) {
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
            var nextRightIL = this.nextRight(nodeIL);
            var nextLeftIR = this.nextLeft(nodeIR);
            while (nextRightIL !== null && nextLeftIR !== null) {
                nodeIL = nextRightIL;
                nodeIR = nextLeftIR;
                nodeOL = this.nextLeft(nodeOL);
                nodeOR = this.nextRight(nodeOR);
                this.setAncestor(nodeOR, node);
                var shift = (this.getX(nodeIL) + shiftIL) - (this.getX(nodeIR) + shiftIR) + this.getDistance();
                if (shift > 0) {
                    var tmpAncestor = this.ancestor(nodeIL, node, defaultAncestor);
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
    };
    TreeLayout.prototype.moveSubtree = function (subtreeL, subtreeR, shift) {
        var subtrees = subtreeR.idx - subtreeL.idx;
        subtreeR.layout.change -= shift / subtrees;
        subtreeR.layout.shift += shift;
        subtreeL.layout.change += shift / subtrees;
        subtreeR.layout.x += shift;
        subtreeR.layout.mod += shift;
    };
    TreeLayout.prototype.executeShifts = function (node) {
        var shift = 0, change = 0;
        for (var i = node.children.length - 1; i >= 0; i--) {
            var child = node.children[i];
            child.layout.x += shift;
            child.layout.mod += shift;
            change += child.layout.change;
            shift += child.layout.shift + change;
        }
    };
    TreeLayout.prototype.nextLeft = function (node) {
        return node.isLeaf() ? node.layout.thread : node.getFirstChild();
    };
    TreeLayout.prototype.nextRight = function (node) {
        return node.isLeaf() ? node.layout.thread : node.getLastChild();
    };
    TreeLayout.prototype.setThread = function (node, thread) {
        node.layout.thread = thread;
    };
    TreeLayout.prototype.setAncestor = function (node, ancestor) {
        node.layout.ancestor = ancestor;
    };
    TreeLayout.prototype.ancestor = function (nodeIL, node, defaultAncestor) {
        if (node.parent.isParentOf(nodeIL.layout.ancestor)) {
            return nodeIL.layout.ancestor;
        }
        else {
            return defaultAncestor;
        }
    };
    TreeLayout.prototype.getDistance = function () {
        //@lk return proper distance using node1 and node2      
        return constants_1.TREE_LAYOUT_DEFAULTS.nodeDistance + (constants_1.TREE_LAYOUT_DEFAULTS.nodeRadius * 2);
    };
    TreeLayout.prototype.getMod = function (node) {
        return (node === null) ? 0 : node.layout.mod;
    };
    TreeLayout.prototype.getX = function (node) {
        return (node === null) ? 0 : node.layout.x;
    };
    TreeLayout = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], TreeLayout);
    return TreeLayout;
}());
exports.TreeLayout = TreeLayout;
//# sourceMappingURL=treelayout.js.map