(function() {
  'use strict';

  angular.module('WVTM.renderer')
    .factory('Renderer', Renderer);

  Renderer.$inject = ['RendererDefaults', 'Snap', 'TreeLayout', 'TaskType', 'TaskRelation'];

  function Renderer(RendererDefaults, Snap, TreeLayout, TaskType, TaskRelation) {
    var paper,
      canvasElm,
      modelGroup = null,
      treeSets = {
        node: null,
        link: null
      },
      filters = {},
      prevHovered = null,
      prevSelected = null;

    var api = {
      init: init,
      render: render,
      update: update,
      getPaper: getPaper,
      startSimulation: startSimulation,
      updateSimulation: updateSimulation,
      stopSimulation: stopSimulation,
      // update: update,
      selectEffect: selectEffect,
      hoverEffect: hoverEffect,
      // getTreeSets: getTreeSets,
    };

    return api;


    /***************************/

    function getPaper() {
      return paper;
    }


    function init(elm) {
      canvasElm = elm;
      paper = Snap('#' + canvasElm);

      paper.attr({
        height: '100%',
        width: '100%'
      });
      //create a group of entire model 
      modelGroup = paper.g();
      modelGroup.attr(angular.extend({
        id: 'model-group'
      }, RendererDefaults.baseAttrs));
      //add filters for reuse
      addFilters();
      //add basic shapes to defs
      addDefs();

      treeSets.nodeSet = Snap.set();
      treeSets.linkSet = Snap.set();
    }

    function render(model) {
    	console.log(model);
    	if(!paper) {
    		throw new Error('Renderer not initialized');
    	}
      modelGroup.clear();
      TreeLayout.calculate(model.root, paper.node.width.baseVal.value/2);

      renderTaskTree(model.root);

      //add classes to nodes and sets
      treeSets.nodeSet.attr({
        class: 'tree-node'
      });
      treeSets.linkSet.attr({
        class: 'node-links'
      });
    }

    function renderTaskTree(root) {
      (function traverseBF(currentNode) {
	      var aTaskGroup = paper.g().attr({
	        class: 'task'
	      });

        renderTaskNode(currentNode.coord.x, currentNode.coord.y, currentNode, aTaskGroup);

        for (var i = 0; i < currentNode.children.length; i++) {
          var child = currentNode.children[i];
          renderTaskLink(currentNode.coord.x, currentNode.coord.y + 20, child.coord.x, child.coord.y - 20, aTaskGroup);
          traverseBF(child);
        }
        currentNode.layout.el = aTaskGroup;
        modelGroup.add(aTaskGroup);
      })(root);
    }

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
    function renderTaskNode(cx, cy, origNode, group) {

      var node = paper.use('def-node').attr({
          x: cx,
          y: cy,
          id: origNode.data.id,
          class: 'tree-node'
        }).data('origNode', origNode),
        // var node = paper.circle(cx, cy, RendererDefaults.radius).attr({
        //     id: origNode.data.id,
        //     class: 'tree-node'
        //   }).data('origNode', origNode),
        name = paper.text(cx, cy, origNode.data.name).attr({
            dy: 3
          });

      group.add(name);
      group.add(node);

      //render task relation
    	renderTaskRelation(cx, cy, origNode, group);

      // modelGroup.add(group);
      treeSets.nodeSet.push(node);

      return group;

    }

    // function renderNodeLink(x1, y1, x2, y2) {
    function renderTaskLink(x1, y1, x2, y2, group) {
      var levelCentre = y1 + (y2 - y1) / 2,
        link = paper.path([
          ['M', x1, y1],
          ['C', x1, levelCentre, x2, levelCentre, x2, y2]
        ]);

      group.add(link);
      treeSets.linkSet.push(link);

      return link;
    }

    function renderTaskRelation(cx, cy, origNode, group) {
      var rightSibling = origNode.getRightSibling();
      if (rightSibling && origNode.relation) {

      	//check if relation already exists if yes then update it
      	var relationText = group.select('.rel-text'),
            relationLink = null,
            textBox = {};

      	if(relationText) {
      		relationLink = group.select('.rel-link');
      		relationText.attr({
      			text: origNode.relation
      		});

          textBox = relationText.getBBox();

          relationLink.attr({d: [
              ['M', cx + RendererDefaults.radius, cy],
              ['L', textBox.x - 2, cy],
              ['M', textBox.x2 + 2, cy],
              ['L', rightSibling.coord.x - RendererDefaults.radius, cy],
            ]});

      	} else {
        	relationText = paper.text(cx + (rightSibling.coord.x - cx) / 2, cy + 3, origNode.relation);
          textBox = relationText.getBBox();
          relationLink = paper.path([
              ['M', cx + RendererDefaults.radius, cy],
              ['L', textBox.x - 2, cy],
              ['M', textBox.x2 + 2, cy],
              ['L', rightSibling.coord.x - RendererDefaults.radius, cy],
            ]);
	        relationLink.addClass('rel-link');
	        relationText.addClass('rel-text');
	        group.add(relationText);
          group.add(relationLink);
      	}
      }
    }

    function update(type, taskId, model) {
    	if(!taskId || !model) {
    		console.log('renderer: no task provided to update');
    	}

			var node = model.searchNode(taskId),
					taskGroup = node.layout.el;

			// console.log(node.layout.el);
			// console.log(taskGroup);
      
			if(type === 'task') {
				render(model);
			}
			if(type === 'relation') {
				renderTaskRelation(node.coord.x, node.coord.y, node, taskGroup);
			}
    }

    function startSimulation(ets) {
      console.log(ets);

      var mask = paper.mask().attr({class: 'simmask'});
      //create a base mask that will fade out everyting
      mask.add(paper.rect(0, 0, paper.node.width.baseVal.value, paper.node.height.baseVal.value).attr({fill: '#333', stroke: '#000'}));

      //for each enabled task in the set create a circular mask that wil highlight the node
      ets.forEach(function(task) {
        mask.add(paper.circle(task.coord.x, task.coord.y, RendererDefaults.radius+2).attr({fill: '#fff', stroke: '#000'}));
        modelGroup.select('#' + task.data.id).addClass('enabled');
      });

      //@lk think of a way to highlight relation between siblings if both are enabled

      modelGroup.attr({mask: mask});
      paper.addClass('simulation');
    }

    function updateSimulation() {

    }

    /**
     * remove mask from model
     * delete mask node ??
     * 
     * @return {[type]} [description]
     */
    function stopSimulation() {
      modelGroup.attr({mask: null});
      paper.select('.simmask').remove();
      paper.removeClass('simulation');
    }

    function selectEffect(snapElm) {
      if (prevSelected !== null && (prevSelected !== snapElm)) {
        prevSelected.attr({
          filter: '',
          fill: 'transparent'
        });
        prevSelected.data('selected', false);
      }

      if (snapElm.data('selected')) {
        prevSelected = prevSelected || snapElm;
        prevSelected.attr({
          filter: '',
          fill: 'transparent'
        });
        prevSelected.data('selected', false);
        snapElm.data('hover', true);
      } else {
        snapElm.attr({
          filter: filters.selected,
          fill: '#3D5AFE',
          fillOpacity: 0.3,
        });
        snapElm.data('selected', true);
        snapElm.data('hover', false);
        prevSelected = snapElm;
      }
    }

    function hoverEffect(snapElm) {
      if (snapElm.data('selected')) {
        prevHovered = null;
        return;
      }

      if (prevHovered !== null && prevHovered.data('hover') && (prevHovered !== snapElm)) {
        prevHovered = prevHovered || snapElm;
        prevHovered.attr({
          filter: ''
        });
        snapElm.data('hover', false);
      }

      if (snapElm.data('hover')) {
        snapElm.attr({
          filter: ''
        });
        snapElm.data('hover', false);
      } else {
        snapElm.attr({
          filter: filters.hover
        });
        snapElm.data('hover', true);
        prevHovered = snapElm;
      }

    }

    function addFilters() {
      filters.hover = paper.filter(Snap.filter.shadow(0, 0, 2, '#01579B', 1.0));
      filters.selected = paper.filter(Snap.filter.shadow(0, 0, 2, '3D5AFE', 1));
    }

    function addDefs() {
      paper.el('circle', {
        r: 20,
        id: 'def-node'
      }).toDefs();

    }

  }
})();
