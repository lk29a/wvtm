import {Simulator} from "./simulator";
import {RelationSimulator} from "./RelationSimulator";

class Deactivate implements RelationSimulator {
  simulate(taskId: string, sim: Simulator) {
    const leftSibling = sim.treeUtils.getLeftSibling(taskId);


  }

}
