export const atmDemo = {
  "TASK_0": {
    "id": "TASK_0",
    "type": "Abstract",
    "name": "Access ATM",
    "description": "Default abstract node",
    "relation": null,
    "children": ["TASK_1", "TASK_2", "TASK_3"],
    "coords": {"x": 500, "y": 36}
  },
  "TASK_1": {
    "id": "TASK_1",
    "type": "Abstract",
    "name": "Enable Access",
    "description": "",
    "relation": "ENABLE",
    "parent": "TASK_0",
    "children": ["TASK_4", "TASK_5", "TASK_6"],
    "coords": {"x": 180, "y": 156}
  },
  "TASK_2": {
    "id": "TASK_2",
    "type": "Abstract",
    "name": "Access",
    "description": "",
    "relation": "DEACT",
    "parent": "TASK_0",
    "children": ["TASK_7", "TASK_8", "TASK_9"],
    "coords": {"x": 660, "y": 156}
  },
  "TASK_10": {
    "id": "TASK_10",
    "type": "Interaction",
    "name": "Select Withdrawl",
    "description": "",
    "relation": "ENABLE",
    "parent": "TASK_7",
    "children": [],
    "coords": {"x": 100, "y": 396}
  },
  "TASK_3": {
    "id": "TASK_3",
    "type": "Interaction",
    "name": "Close Access",
    "description": "",
    "relation": null,
    "parent": "TASK_0",
    "children": [],
    "coords": {"x": 820, "y": 156}
  },
  "TASK_11": {
    "id": "TASK_11",
    "type": "System",
    "name": "Show Possible Amounts",
    "description": "",
    "relation": "ENABLEINFO",
    "parent": "TASK_7",
    "children": [],
    "coords": {"x": 260, "y": 396}
  },
  "TASK_4": {
    "id": "TASK_4",
    "type": "Interaction",
    "name": "Insert Card",
    "description": "",
    "relation": "ENABLE",
    "parent": "TASK_1",
    "children": [],
    "coords": {"x": 20, "y": 276}
  },
  "TASK_12": {
    "id": "TASK_12",
    "type": "User",
    "name": "Decide Amount",
    "description": "",
    "relation": "ENABLEINFO",
    "parent": "TASK_7",
    "children": [],
    "coords": {"x": 420, "y": 396}
  },
  "TASK_5": {
    "id": "TASK_5",
    "type": "System",
    "name": "Require Password",
    "description": "",
    "relation": "ENABLE",
    "parent": "TASK_1",
    "children": [],
    "coords": {"x": 180, "y": 276}
  },
  "TASK_13": {
    "id": "TASK_13",
    "type": "Interaction",
    "name": "Select Amount",
    "description": "",
    "relation": "ENABLEINFO",
    "parent": "TASK_7",
    "children": [],
    "coords": {"x": 580, "y": 396}
  },
  "TASK_6": {
    "id": "TASK_6",
    "type": "Interaction",
    "name": "Insert Password",
    "description": "",
    "relation": null,
    "parent": "TASK_1",
    "children": [],
    "coords": {"x": 340, "y": 276}
  },
  "TASK_14": {
    "id": "TASK_14",
    "type": "System",
    "name": "Provide Cash",
    "description": "",
    "relation": "ENABLEINFO",
    "parent": "TASK_7",
    "children": [],
    "coords": {"x": 740, "y": 396}
  },
  "TASK_7": {
    "id": "TASK_7",
    "type": "Abstract",
    "name": "Withdraw Cash",
    "description": "",
    "relation": "CHOICE",
    "parent": "TASK_2",
    "children": ["TASK_10", "TASK_11", "TASK_12", "TASK_13", "TASK_14", "TASK_15"],
    "coords": {"x": 500, "y": 276}
  },
  "TASK_15": {
    "id": "TASK_15",
    "type": "Interaction",
    "name": "Check Cash",
    "description": "",
    "relation": null,
    "parent": "TASK_7",
    "children": [],
    "coords": {"x": 900, "y": 396}
  },
  "TASK_8": {
    "id": "TASK_8",
    "type": "Abstract",
    "name": "Deposit Cash",
    "description": "",
    "relation": "CHOICE",
    "parent": "TASK_2",
    "children": [],
    "coords": {"x": 660, "y": 276}
  },
  "TASK_9": {
    "id": "TASK_9",
    "type": "Abstract",
    "name": "Get Information",
    "description": "",
    "relation": null,
    "parent": "TASK_2",
    "children": [],
    "coords": {"x": 820, "y": 276}
  }
}
