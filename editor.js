function createWorkspace() {
  let workspace = new Blockyly.Workspace();
  return Blockly.serialization.workspaces.save(workspace);
}

function save() {
  let workspace = Blockly.getMainWorkspace();
  let serialized = Blockly.serialization.workspaces.save(workspace);
  return JSON.stringify(serialized);
}

function load(serialized) {
  let workspace = Blockly.getMainWorkspace();
  let deserialized = JSON.parse(serialized);
  Blockly.serialization.workspaces.load(deserialized, workspace);
}

function createVariable(name, id) {
  let workspace = Blockly.getMainWorkspace();
  if (!id) {
    workspace.createVariable(name);
  } else {
    workspace.createVariable(name, null, id);
  }
}

function deleteVariable(id) {
  let workspace = Blockly.getMainWorkspace();
  workspace.deleteVariableById(id);
}

function emitCode() {
  // Disable variable declaration generation
  let code = javascript.javascriptGenerator.workspaceToCode(
    Blockly.getMainWorkspace()
  );
  // TODO: Exclude "state" variable declarations via the generator (keep temp variable declarations)
  const cleanedCode = code.replace(/^var\s+[\w\s,]+;\s*$/gm, "");
  if (window.parent !== window) {
    window.parent.postMessage({ type: "code", code: cleanedCode }, "*");
  }
}

function setupBlockly() {
  Blockly.defineBlocksWithJsonArray([
    {
      type: "set_position",
      message0: "set position x: %1 y: %2",
      args0: [
        {
          type: "input_value",
          name: "X",
          check: "Number",
        },
        {
          type: "input_value",
          name: "Y",
          check: "Number",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: "Set the position using x and y coordinates",
      helpUrl: "",
    },
    {
      type: "set_direction",
      message0: "set direction: %1 degrees",
      args0: [
        {
          type: "input_value",
          name: "DEGREES",
          check: "Number",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: "Set the direction in degrees",
      helpUrl: "",
    },
    {
      type: "set_speed",
      message0: "set speed: %1",
      args0: [
        {
          type: "input_value",
          name: "SPEED",
          check: "Number",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: "Set the speed in pixels per second in degrees",
      helpUrl: "",
    },
  ]);
  javascript.javascriptGenerator.forBlock["set_position"] = function (block) {
    var x = Blockly.JavaScript.valueToCode(
      block,
      "X",
      Blockly.JavaScript.ORDER_ATOMIC
    );
    var y = Blockly.JavaScript.valueToCode(
      block,
      "Y",
      Blockly.JavaScript.ORDER_ATOMIC
    );
    var code = `setPosition(${x}, ${y});\n`;
    return code;
  };
  javascript.javascriptGenerator.forBlock["set_direction"] = function (block) {
    var angle = Blockly.JavaScript.valueToCode(
      block,
      "DEGREES",
      Blockly.JavaScript.ORDER_ATOMIC
    );
    var code = `setDirection(${angle} * 3.14159 / 180.0);\n`;
    return code;
  };
  javascript.javascriptGenerator.forBlock["set_speed"] = function (block) {
    var speed = Blockly.JavaScript.valueToCode(
      block,
      "SPEED",
      Blockly.JavaScript.ORDER_ATOMIC
    );
    var code = `setSpeed(${speed});\n`;
    return code;
  };

  const inbuiltToolbox = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Object",
        contents: [
          {
            kind: "block",
            type: "set_position",
            inputs: {
              X: {
                shadow: {
                  type: "math_number",
                  fields: {
                    NUM: 20,
                  },
                },
              },
              Y: {
                shadow: {
                  type: "math_number",
                  fields: {
                    NUM: 30,
                  },
                },
              },
            },
          },
          {
            kind: "block",
            type: "set_direction",
            inputs: {
              DEGREES: {
                shadow: {
                  type: "math_number",
                  fields: {
                    NUM: 90,
                  },
                },
              },
            },
          },
          {
            kind: "block",
            type: "set_speed",
            inputs: {
              SPEED: {
                shadow: {
                  type: "math_number",
                  fields: {
                    NUM: 200,
                  },
                },
              },
            },
          },
        ],
      },
      {
        kind: "category",
        name: "Variables",
        custom: "VARIABLE",
      },
      {
        kind: "category",
        name: "Logic",
        contents: [
          { kind: "block", type: "controls_if" },
          { kind: "block", type: "logic_compare" },
          { kind: "block", type: "logic_operation" },
          { kind: "block", type: "logic_negate" },
          { kind: "block", type: "logic_boolean" },
          { kind: "block", type: "logic_null" },
          { kind: "block", type: "logic_ternary" },
        ],
      },
      {
        kind: "category",
        name: "Math",
        contents: [
          { kind: "block", type: "math_number" },
          { kind: "block", type: "math_arithmetic" },
          { kind: "block", type: "math_single" },
          { kind: "block", type: "math_trig" },
          { kind: "block", type: "math_constant" },
          { kind: "block", type: "math_number_property" },
          { kind: "block", type: "math_round" },
          { kind: "block", type: "math_on_list" },
          { kind: "block", type: "math_modulo" },
          { kind: "block", type: "math_constrain" },
          { kind: "block", type: "math_random_int" },
          { kind: "block", type: "math_random_float" },
        ],
      },
      {
        kind: "category",
        name: "Loops",
        contents: [
          { kind: "block", type: "controls_repeat_ext" },
          { kind: "block", type: "controls_whileUntil" },
          { kind: "block", type: "controls_for" },
          { kind: "block", type: "controls_flow_statements" },
        ],
      },
      {
        kind: "category",
        name: "(debug)",
        contents: [
          { kind: "block", type: "text" },
          { kind: "block", type: "text_join" },
          { kind: "block", type: "text_print" },
        ],
      },
    ],
  };

  Blockly.inject("blocklyDiv", {
    toolbox: inbuiltToolbox,
    scrollbars: false,
    horizontalLayout: false,
    toolboxPosition: "start",
  });

  let workspace = Blockly.getMainWorkspace();
  workspace.addChangeListener((e) => {
    if (
      e.isUiEvent ||
      e.type == Blockly.Events.FINISHED_LOADING ||
      workspace.isDragging()
    ) {
      return;
    }
    emitCode();
  });
}

setupBlockly();
