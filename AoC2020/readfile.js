"use strict";
exports.__esModule = true;
exports.readLines = void 0;
var fs = require("fs");
function readLines(path) {
    var file = fs.readFileSync(path, "utf-8");
    return file.split("\n");
}
exports.readLines = readLines;
