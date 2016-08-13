import {Injectable} from "@angular/core";
import {ITask, ICoord} from "../../taskmodel";
import {RENDERER_DEFAULTS} from "../../shared";


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
      taskName = taskName + "...";
    }

    return taskName;
  }


  /**
   * generates the svg path string for link between given node and its parent
   * 
   * @param  {Task}   task A task-node to calculate path string for
   * @return {string}       Formatted SVG path string
   */
  getLinkPath(taskCoord: ICoord, parentCoord: ICoord) {
    let levelCenter = parentCoord.y + (taskCoord.y - parentCoord.y) / 2;
    return this.getSVGPath(
      ["M", parentCoord.x, parentCoord.y + RENDERER_DEFAULTS.nodeRadius],
      ["C", parentCoord.x, levelCenter, taskCoord.x, levelCenter, taskCoord.x, taskCoord.y - RENDERER_DEFAULTS.nodeRadius]
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
    return pathParts.map((part) => part[0] + part.slice(1).join(",")).join("");
  }

}
