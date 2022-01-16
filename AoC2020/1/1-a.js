"use strict";
exports.__esModule = true;
var readfile_1 = require("../readfile");
var lines = (0, readfile_1.readLines)("./1/input-a.txt").map(function (s) { return parseInt(s, 10); });
var count = 0;
var previous = Infinity;
for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
    var line = lines_1[_i];
    if (line > previous) {
        count++;
    }
    previous = line;
}
console.log(count);
