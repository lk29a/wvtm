import {Simulator} from "./simulator";

export interface RelationSimulator {
    simulate(taskId: string, sim: Simulator);
}
