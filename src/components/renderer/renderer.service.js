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
var core_1 = require('@angular/core');
var treelayout_1 = require('./treelayout');
var logger_service_1 = require('../common/logger.service');
var constants_1 = require('../common/constants');
var Renderer = (function () {
    function Renderer(treeLayout, logger) {
        this.treeLayout = treeLayout;
        this.logger = logger;
        this.defTaskNodes = ['abstract', 'user', 'interaction', 'system'];
        this.filters = {};
        this.currentState = {
            selected: null
        };
    }
    // root <svg> element
    Renderer.prototype.init = function (el, dim) {
        this.svgCanvas = Snap(el).attr(dim);
        // this.svgCanvas.attr(dim);
        this.modelGroup = this.svgCanvas.g();
        this.modelGroup.attr(Object.assign({
            id: 'model-group'
        }, constants_1.RENDERER_DEFAULTS.baseAttrs));
        this.addFilterDefs();
        this.addDefs();
    };
    Renderer.prototype.render = function (model) {
        if (!this.svgCanvas) {
            throw new Error('Renderer not initialized');
        }
        this.modelGroup.clear();
        this.treeLayout.calculate(model.root, this.svgCanvas.node.width.baseVal.value / 2);
        this.renderTaskTree(model.root);
    };
    Renderer.prototype.update = function (model, type, taskId) {
        if (!taskId || !model) {
            this.logger.error('no model or taskId provided');
            throw new Error('renderer: no task provided to update');
        }
        var updatedTask = model.searchNode(taskId), taskGroup = this.modelGroup.select('#' + taskId);
        if (type === 'task') {
            this.render(model);
        }
        else if (type === 'relation') {
            this.renderTaskRelation(updatedTask.coord.x, updatedTask.coord.y, updatedTask, taskGroup);
        }
    };
    Renderer.prototype.startSimulation = function () {
        this.deSelectTask();
        var mask = this.svgCanvas.mask().attr({ class: 'simmask' });
        //create a base mask that will fade out everyting
        mask.add(this.svgCanvas.rect(0, 0, this.svgCanvas.node.width.baseVal.value, this.svgCanvas.node.height.baseVal.value)
            .attr({ fill: '#333', stroke: '#000' }));
    };
    Renderer.prototype.enableSimTasks = function (mask, ets) {
        //for each enabled task in the set create a circular mask that wil highlight the node
        ets.forEach(function (task) {
            mask.add(this.svgCanvas.rect(task.coord.x - 22, task.coord.y - 22, 44, 44).data({ 'fortask': task.data.id }).attr({ fill: '#fff', stroke: '#000', class: 'maskrect' }));
            modelGroup.select('#' + task.data.id).addClass('enabled');
        });
    };
    Renderer.prototype.selectTask = function (taskId) {
        var curTask = this.getTaskNodeById(taskId);
        if (curTask.hasClass('selected')) {
            curTask.removeClass('selected');
            this.currentState.selected = null;
        }
        else {
            if (this.currentState.selected) {
                this.currentState.selected.removeClass('selected');
            }
            curTask.addClass('selected');
            this.currentState.selected = curTask;
        }
    };
    Renderer.prototype.deSelectTask = function () {
        if (this.currentState.selected) {
            this.currentState.selected.removeClass('selected');
        }
    };
    Renderer.prototype.highlightTask = function (taskId) {
        var curTask = this.getTaskNodeById(taskId);
        if (this.currentState.hovered !== null && this.currentState.hovered.hasClass('hover') && (this.currentState.hovered !== curTask)) {
            this.currentState.hovered = this.currentState.hovered || curTask;
            this.currentState.hovered.attr({
                filter: ''
            });
            curTask.removeClass('hover');
        }
        if (curTask.hasClass('hover')) {
            curTask.attr({
                filter: ''
            });
            curTask.removeClass('hover');
        }
        else {
            curTask.attr({
                filter: this.filters.hover
            });
            curTask.addClass('hover');
            this.currentState.hovered = curTask;
        }
    };
    Renderer.prototype.renderTaskTree = function (root) {
        var _this = this;
        (function traverseBF(currentNode) {
            var aTaskGroup = _this.svgCanvas.g().attr({
                class: 'task',
                id: currentNode.data.id,
            });
            _this.renderTaskNode(currentNode.coord.x, currentNode.coord.y, currentNode, aTaskGroup);
            for (var i = 0; i < currentNode.children.length; i++) {
                var child = currentNode.children[i];
                _this.renderTaskLink(currentNode.coord.x, currentNode.coord.y + 20, child.coord.x, child.coord.y - 20, aTaskGroup);
                traverseBF(child);
            }
            // currentNode.layout.el = aTaskGroup;
            _this.modelGroup.add(aTaskGroup);
        })(root);
    };
    /**
     * draws a task node
     *
     * Create a group for each node, will contain
     * circle || task specific icon
     * name||id text
     * task relation and relation text || icon
     * and all the links from this node
     *
     * @param  {[int]} cx
     * @param  {[int]} cy
     * @param  {[TreeNode]} origNode
     * @return {[group]} group  a group containing task specific elements
     */
    Renderer.prototype.renderTaskNode = function (cx, cy, origNode, group) {
        var taskName = origNode.data.name;
        if (taskName.length > 12) {
            taskName = taskName.substr(0, 12);
            if (taskName.substr(-1) === " ") {
                taskName = taskName.substring(0, taskName.length - 1);
            }
            taskName = taskName + "...";
        }
        var node = this.svgCanvas.use('def-' + this.defTaskNodes[origNode.data.type]).attr({
            x: cx - 20,
            y: cy - 20,
            // id: origNode.data.id,
            class: 'task-node'
        }).data('origNode', origNode), name = this.svgCanvas.text(cx, cy + 35, taskName).attr({
            dy: 3,
            class: 'task-name'
        });
        group.add(name);
        group.add(node);
        //render task relation
        this.renderTaskRelation(cx, cy, origNode, group);
        // modelGroup.add(group);
        // this.treeSets.nodeSet.push(node);
        return group;
    };
    // function renderNodeLink(x1, y1, x2, y2) {
    Renderer.prototype.renderTaskLink = function (x1, y1, x2, y2, group) {
        var levelCentre = y1 + (y2 - y1) / 2, link = this.svgCanvas.path([
            ['M', x1, y1],
            ['C', x1, levelCentre, x2, levelCentre, x2, y2]
        ]);
        group.add(link);
        // treeSets.linkSet.push(link);
        return link;
    };
    Renderer.prototype.renderTaskRelation = function (cx, cy, origNode, group) {
        if (origNode.data.relation) {
            var rightSibling = origNode.getRightSibling();
            //check if relation already exists if yes then update it
            var relationText = group.select('.rel-text'), relationLink = null, textBox;
            if (relationText) {
                relationLink = group.select('.rel-link');
                relationText.attr({
                    text: origNode.data.relation
                });
                textBox = relationText.getBBox();
                relationLink.attr({
                    d: [
                        ['M', cx + constants_1.RENDERER_DEFAULTS.radius, cy],
                        ['L', textBox.x - 2, cy],
                        ['M', textBox.x2 + 2, cy],
                        ['L', rightSibling.coord.x - constants_1.RENDERER_DEFAULTS.radius, cy],
                    ]
                });
            }
            else {
                relationText = this.svgCanvas.text(cx + (rightSibling.coord.x - cx) / 2, cy + 3, origNode.data.relation);
                textBox = relationText.getBBox();
                relationLink = this.svgCanvas.path([
                    ['M', cx + constants_1.RENDERER_DEFAULTS.radius, cy],
                    ['L', textBox.x - 2, cy],
                    ['M', textBox.x2 + 2, cy],
                    ['L', rightSibling.coord.x - constants_1.RENDERER_DEFAULTS.radius, cy],
                ]);
                relationLink.addClass('rel-link');
                relationText.addClass('rel-text');
                group.add(relationText);
                group.add(relationLink);
            }
        }
    };
    Renderer.prototype.getTaskNodeById = function (taskId) {
        return this.modelGroup.select("#" + taskId + ' .task-node');
    };
    Renderer.prototype.addFilterDefs = function () {
        this.filters = {
            hover: this.svgCanvas.filter(Snap.filter.shadow(0, 0, 2, '#01579B', 1.0)),
            selected: this.svgCanvas.filter(Snap.filter.shadow(0, 0, 2, '3D5AFE', 1))
        };
    };
    Renderer.prototype.addDefs = function () {
        this.svgCanvas.el('circle', {
            r: 20,
            id: 'def-node'
        }).toDefs();
        //Abstract
        var abstract = this.svgCanvas.el('g', {
            id: 'def-abstract',
        });
        abstract.add(this.svgCanvas.path("m9.60326,13.29152c0.43109,0 0.84758,0.06609 1.23959,0.18871c1.48046,-1.68009 3.12194,-3.20842 4.89953,-4.56544c-0.07428,-0.31784 -0.11808,-0.64742 -0.11808,-0.98874c0,-0.47133 0.079,-0.92396 0.21898,-1.3479c-1.99098,-1.44702 -4.15715,-2.661 -6.46071,-3.59974c-2.16016,1.35181 -4.04379,3.11407 -5.54487,5.17938c1.11464,1.99836 2.43968,3.86236 3.94547,5.55854c0.55131,-0.26958 1.16788,-0.4248 1.82009,-0.4248zm-4.2018,4.25499c0,-0.59742 0.12323,-1.16615 0.34264,-1.68182c-1.34908,-1.4992 -2.5702,-3.11754 -3.64062,-4.84154c-1.34306,2.70013 -2.10348,5.7481 -2.10348,8.9774c0,3.74018 1.01589,7.23817 2.78059,10.23223c0.63032,-3.59887 1.82654,-6.9986 3.47918,-10.11702c-0.53714,-0.71395 -0.85831,-1.60225 -0.85831,-2.56925zm14.42507,-13.87633c1.10992,0 2.11636,0.43872 2.86732,1.15049c2.19236,-0.95526 4.50193,-1.68748 6.90339,-2.15576c-2.8991,-1.69182 -6.25934,-2.66491 -9.84628,-2.66491c-2.44483,0 -4.78574,0.4535 -6.94718,1.27658c1.71576,0.85743 3.35036,1.85922 4.88837,2.98841c0.62602,-0.37567 1.35465,-0.59481 2.13439,-0.59481l0,0.00001zm6.28424,20.04316c0.26148,-0.55133 0.63288,-1.03874 1.09188,-1.42659c-1.24002,-3.86584 -3.20523,-7.4008 -5.73594,-10.44225c-0.50365,0.21653 -1.05796,0.33654 -1.64019,0.33654c-0.91155,0 -1.75268,-0.29741 -2.44139,-0.79656c-1.52297,1.17223 -2.93259,2.48664 -4.21426,3.92106c0.40017,0.6509 0.63504,1.4179 0.63504,2.24098c0,0.44481 -0.06784,0.87265 -0.19236,1.27528c3.68613,2.49403 7.92743,4.20368 12.49721,4.89154l0.00001,0zm5.45084,5.7442c0.05796,0.80569 0.08845,1.61877 0.08845,2.43881c0,1.44399 -0.09102,2.86623 -0.26277,4.26325c3.34865,-2.47752 5.8991,-5.99464 7.18506,-10.08441c-1.52297,0.37306 -3.0863,0.6396 -4.68098,0.79482c-0.37527,1.1644 -1.231,2.10663 -2.32975,2.58752l-0.00001,0.00001zm-6.43538,-2.88406c-4.87505,-0.81787 -9.39587,-2.70144 -13.33019,-5.4007c-0.63847,0.39654 -1.38772,0.63003 -2.19193,0.63003c-0.2954,0 -0.58308,-0.03174 -0.86174,-0.09044c-1.88364,3.61626 -3.08716,7.64951 -3.43323,11.9258c1.88063,2.04183 4.17518,3.6867 6.75268,4.7911c3.19923,-4.98372 7.67368,-9.1061 13.0644,-11.8558l0.00001,0zm7.88363,-21.3967c-3.16487,0.30915 -6.18806,1.11353 -9.00257,2.32272c0.01502,0.14044 0.0219,0.28219 0.0219,0.42611c0,0.67177 -0.15802,1.30485 -0.43151,1.87009c2.81151,3.34277 4.99571,7.23862 6.3744,11.50317c1.70846,0.03088 3.1696,1.09093 3.79778,2.59621c1.90124,-0.19522 3.75268,-0.5635 5.53628,-1.09484c0.12623,-0.91483 0.19622,-1.84835 0.19622,-2.7997c0,-5.87855 -2.50493,-11.16446 -6.49249,-14.82377zm-5.76943,23.67029c-5.0322,2.38707 -9.23958,6.06334 -12.28681,10.5579c1.53585,0.38828 3.14212,0.59742 4.79733,0.59742c2.97939,0 5.80249,-0.67221 8.33534,-1.86836c0.40704,-2.01619 0.62259,-4.1015 0.62259,-6.2377c0,-0.77177 -0.03435,-1.53573 -0.09146,-2.29272c-0.50794,-0.16479 -0.97338,-0.42306 -1.37699,-0.75656l0,0.00001z"));
        abstract.add(this.svgCanvas.rect(0, 0, 40, 40).attr({ fill: "transparent", stroke: 'transparent', class: 'node-area' }));
        abstract.toDefs();
        //User
        var user = this.svgCanvas.el('g', {
            id: 'def-user',
        });
        //user head
        user.add(this.svgCanvas.path("m19.93249,21.18492c4.90764,0 8.88652,-4.74245 8.88652,-10.59251c0,-8.11242 -3.97869,-10.59241 -8.88652,-10.59241c-4.90803,0 -8.88653,2.47998 -8.88653,10.59241c0.0001,5.85006 3.9786,10.59251 8.88653,10.59251z"));
        //user body
        user.add(this.svgCanvas.path("m39.55578,36.77566l-4.48336,-10.28522c-0.20507,-0.47064 -0.56531,-0.86099 -1.01371,-1.09873l-6.95791,-3.6886c-0.15343,-0.08119 -0.33922,-0.0654 -0.47716,0.04094c-1.96794,1.51581 -4.28178,2.31702 -6.69114,2.31702c-2.40974,0 -4.7234,-0.80121 -6.69134,-2.31702c-0.13833,-0.10634 -0.32411,-0.12212 -0.47755,-0.04094l-6.95743,3.6886c-0.44859,0.23774 -0.80845,0.62789 -1.01371,1.09873l-4.48336,10.28522c-0.3091,0.70908 -0.24575,1.52035 0.16952,2.17073c0.41507,0.65028 1.11755,1.03836 1.87921,1.03836l35.14903,0c0.76166,0 1.46433,-0.38828 1.8794,-1.03846c0.41507,-0.65028 0.47862,-1.46185 0.16952,-2.17063z"));
        user.add(this.svgCanvas.rect(0, 0, 40, 40).attr({ fill: "transparent", stroke: 'transparent', class: 'node-area' }));
        user.toDefs();
        //Interaction
        var interaction = this.svgCanvas.el('g', {
            id: 'def-interaction',
        });
        interaction.add(this.svgCanvas.path("m38.08311,26.28428c-0.47194,-3.48674 -3.01218,-6.05149 -5.99342,-6.05149c-2.98145,0 -5.52147,2.56475 -5.99354,6.05149l-1.56083,11.52365c-0.07234,0.53458 0.05681,1.0805 0.35336,1.49319c0.29669,0.41143 0.73085,0.64936 1.18865,0.64936l12.02453,0c0.45766,0 0.89196,-0.23792 1.18858,-0.64936c0.29655,-0.41251 0.42562,-0.95845 0.35342,-1.49319l-1.56075,-11.52365z"));
        interaction.add(this.svgCanvas.circle(28.66828, 8.94448, 5.53566));
        interaction.add(this.svgCanvas.path("m8.89644,25.92836c0.39764,1.27881 1.41875,2.07028 2.50547,2.07028c0.30697,0 0.6185,-0.06348 0.92323,-0.19607c1.38404,-0.60386 2.09257,-2.42255 1.58223,-4.06142l-6.6154,-21.26589c-0.50978,-1.64028 -2.04584,-2.47526 -3.42856,-1.87447c-1.38418,0.60394 -2.09278,2.42264 -1.58223,4.06142l6.61526,21.26615z"));
        interaction.add(this.svgCanvas.path("m12.18361,35.40328l-6.6629,0c-0.83516,0 -1.51521,-0.80556 -1.51521,-1.79491l0,-17.38214c0,-1.31047 -0.89651,-2.37226 -2.00282,-2.37226c-1.10631,-0.00017 -2.00268,1.0617 -2.00268,2.37226l0,17.38198c0,3.60573 2.47664,6.53958 5.52071,6.53958l6.66304,0c1.10631,0 2.00281,-1.06203 2.00281,-2.37242c-0.00014,-1.31039 -0.89664,-2.37208 -2.00295,-2.37208z"));
        interaction.add(this.svgCanvas.path("m18.94634,36.41235c-1.43567,0 -2.64573,1.09187 -3.09416,2.61099c-0.06268,0.21314 -0.0347,0.44864 0.07549,0.63345c0.11018,0.18372 0.28941,0.29327 0.47977,0.29327l5.07745,0c0.19043,0 0.36903,-0.10955 0.47977,-0.29327c0.11012,-0.18471 0.13824,-0.42015 0.07563,-0.63345c-0.44829,-1.51913 -1.65835,-2.61099 -3.09394,-2.61099z"));
        interaction.add(this.svgCanvas.rect(0, 0, 40, 40).attr({ fill: "transparent", stroke: 'transparent', class: 'node-area' }));
        interaction.toDefs();
        //System
        var system = this.svgCanvas.el('g', {
            id: 'def-system',
        });
        system.add(this.svgCanvas.path("m25.54311,2.36914l0,35.45584l14.39792,-7.08214l0,-23.91892l-14.39792,-4.45478zm13.42352,2.59486c-0.78526,-0.25822 -14.40614,-4.75092 -14.40614,-4.75092s0.84694,0.4713 0.84694,1.29472l14.39791,4.61188c0,0 -0.05962,-0.89746 -0.83871,-1.15568zm-16.47003,-4.964l-18.23174,0c-1.44514,0 -2.61687,1.03108 -2.61687,2.29872l0,34.98996c0,1.26763 1.17379,2.30052 2.61687,2.30052l18.23174,0c1.44308,0 2.61481,-1.03289 2.61481,-2.30052l0,-34.98996c0.00205,-1.26763 -1.17173,-2.29872 -2.61481,-2.29872zm1.26013,37.29048c0,0.61214 -0.5612,1.10873 -1.26013,1.10873l-18.23174,0c-0.69687,0 -1.26218,-0.49658 -1.26218,-1.10873l0,-34.99177c0,-0.61215 0.56531,-1.10873 1.26218,-1.10873l18.23174,0c0.69893,0 1.26013,0.49658 1.26013,1.10873c0,0 0,34.99177 0,34.99177zm-17.3848,-28.37912l14.11423,0c0.49747,0 0.90038,-0.35393 0.90038,-0.78911l0,-4.17308c0,-0.43518 -0.40291,-0.79092 -0.90038,-0.79092l-14.11423,0c-0.49542,0 -0.89833,0.35573 -0.89833,0.79092l0,4.17308c0,0.43518 0.40291,0.78911 0.89833,0.78911zm11.40691,-1.3507l2.68676,0l0,0.54895l-2.68676,0l0,-0.54895zm-11.40691,9.56865l14.11423,0c0.49747,0 0.90038,-0.35393 0.90038,-0.78911l0,-4.17308c0,-0.43518 -0.40291,-0.79092 -0.90038,-0.79092l-14.11423,0c-0.49542,0 -0.89833,0.35393 -0.89833,0.79092l0,4.17308c0,0.43699 0.40291,0.78911 0.89833,0.78911zm11.15818,-1.11595l2.68676,0l0,0.54895l-2.68676,0l0,-0.54895zm-4.07434,15.01479c-1.5397,0 -2.7916,1.0997 -2.7916,2.4504c0,1.35431 1.2519,2.4522 2.7916,2.4522s2.7916,-1.09789 2.7916,-2.4522c0,-1.3507 -1.2519,-2.4504 -2.7916,-2.4504zm0,3.71442c-0.79143,0 -1.43486,-0.5652 -1.43486,-1.26221c0,-0.69341 0.64342,-1.25861 1.43486,-1.25861s1.43486,0.5652 1.43486,1.25861c0,0.69521 -0.64342,1.26221 -1.43486,1.26221zm-8.00478,-7.85139l15.91294,0l0,1.20624l-15.91294,0l0,-1.20624zm0.04934,-3.04088l15.91089,0l0,1.20443l-15.91089,0l0,-1.20443zm0,-3.15464l15.91089,0l0,1.20443l-15.91089,0l0,-1.20443z"));
        system.add(this.svgCanvas.rect(0, 0, 40, 40).attr({ fill: "transparent", stroke: 'transparent', class: 'node-area' }));
        system.toDefs();
    };
    Renderer = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [treelayout_1.TreeLayout, logger_service_1.LoggerService])
    ], Renderer);
    return Renderer;
}());
exports.Renderer = Renderer;
//# sourceMappingURL=renderer.service.js.map