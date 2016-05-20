"use strict";
exports.RENDERER_DEFAULTS = {
    radius: 20,
    baseAttrs: {
        fill: 'transparent',
        stroke: "#212121",
        strokeWidth: 1,
    }
};
exports.TREE_LAYOUT_DEFAULTS = {
    nodeDistance: 90,
    levelDistance: 100,
    nodeRadius: 20
};
(function (EDITOR_MODES) {
    EDITOR_MODES[EDITOR_MODES["DRAWING"] = 0] = "DRAWING";
    EDITOR_MODES[EDITOR_MODES["SIMULATION"] = 1] = "SIMULATION";
})(exports.EDITOR_MODES || (exports.EDITOR_MODES = {}));
var EDITOR_MODES = exports.EDITOR_MODES;
//# sourceMappingURL=constants.js.map