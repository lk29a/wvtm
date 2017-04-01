import {Injectable} from '@angular/core';
import {ITask, ICoord} from '../../taskmodel';
import {RENDERER_DEFAULTS} from '../../shared';


@Injectable()
export class SVGHelper {

  constructor() {
  }


  /**
   * Returns task name max of 12 chars with ellipses
   *
   * @param {Task} task [description]
   * @return {string} shortened task name with ellipses
   */
  getTaskName(task: ITask): string {
    let taskName = task.name;

    if (taskName.length > 12) {
      taskName = taskName.substr(0, 12).trim();
      taskName = taskName + '...';
    }

    return taskName;
  }


  /**
   * generates the svg path string for link between given node and its parent
   *
   * @return {string}       Formatted SVG path string
   * @param taskCoords
   * @param parentCoord
   */
  getParentLinkPath(taskCoords, parentCoord) {
    const levelCenter = parentCoord.y + (taskCoords.y - parentCoord.y) / 2;
    return this.getSVGPath(
      ['M', parentCoord.x, parentCoord.y + RENDERER_DEFAULTS.nodeRadius],
      ['C', parentCoord.x, levelCenter, taskCoords.x, levelCenter, taskCoords.x, taskCoords.y - RENDERER_DEFAULTS.nodeRadius]
    );
  }


  getRelationLinkPath(taskCoords, textBox, rSiblingCoords) {
    return this.getSVGPath(
      ['M', taskCoords.x + RENDERER_DEFAULTS.nodeRadius, taskCoords.y],
      ['L', textBox.x - 2, taskCoords.y],
      ['M', textBox.x + textBox.width + 2, taskCoords.y],
      ['L', rSiblingCoords.x - RENDERER_DEFAULTS.nodeRadius, taskCoords.y]
    );
  }

  /**
   * Constructs SVG path from array parts
   * Eg. [["m", "200", "100"], ["l", "400", "400"]] transforms into
   * "m200,100l400,400"
   *
   * @param  {any[]} pathParts array of SVG path parts
   * @returns {string} SVG path string
   */
  getSVGPath(...pathParts: any[]): string {
    return pathParts.map((part) => part[0] + part.slice(1).join(',')).join('');
  }

}
