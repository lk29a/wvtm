export const RENDERER_DEFAULTS = {
  nodeDistance: 120,
  levelDistance: 120,
  nodeRadius: 20,
  baseAttrs: {
    fill: 'transparent',
    stroke: '#212121',
    strokeWidth: 1,
  }
};

export enum EDITOR_MODES {
  DRAWING,
  SIMULATION
}

export const TaskType = {
  'ABSTRACT': 'Abstract',
  'USER': 'User',
  'INTERACTION': 'Interaction',
  'SYSTEM': 'System',
};

export const TaskRelation = {
  'UNRESTRICTED': {
    sym: '|||',
    name: 'Independent Concurrency'
  },
  'CHOICE': {
    sym: '[]',
    name: 'Choice'
  },
  'CONCURRENTINFO': {
    sym: '|[]|',
    name: 'Concurrency with information exchange'
  },
  'RANDOM': {
    sym: '|=|',
    name: 'Order Independence'
  },
  'DEACT': {
    sym: '[>',
    name: 'Deactivation'
  },
  'ENABLE': {
    sym: '>>',
    name: 'Enabling'
  },
  'ENABLEINFO': {
    sym: '[]>>',
    name: 'Enabling with information passing'
  },
  'RESUME': {
    sym: '|>',
    name: 'Suspend/Resume'
  }
};

export const TaskProperty = {
  'ITERATION': {
    sym: 'T*',
    name: 'Iteration'
  },
  'OPTIONAL': {
    sym: '[T]',
    name: 'Optional'
  }
};
