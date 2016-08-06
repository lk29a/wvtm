export const RENDERER_DEFAULTS = {
  nodeDistance: 120,
  levelDistance: 120,
  nodeRadius: 20,
  baseAttrs: {
    fill: "transparent",
    stroke: "#212121",
    strokeWidth: 1,
  }
};

export enum EDITOR_MODES {
  DRAWING,
  SIMULATION
}

export const TaskType = {
  "ABSTRACT": "Abstract",
  "USER": "User",
  "INTERACTION": "Interaction",
  "SYSTEM": "System",
};

export const TaskRelation = {
  "UNRESTRICTED": "|||", // Independent Concurrency
  "CHOICE": "[]", // Choice
  "CONCURRENTINFO": "|[]|", // Concurrency with information exchange
  "RANDOM": "|=|", // Order Independence
  "DEACT": "[>", // Deactivation
  "ENABLE": ">>", // Enabling
  "CHOICEINFO": "[]>>", // Enabling with information passing
  "RESUME": "|>", // Suspend resume
};

export const TaskProperty = {
  "ITERATION": "T*", // Iteration
  "OPTIONAL": "[T]", // Optional
};
