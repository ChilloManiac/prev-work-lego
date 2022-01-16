"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var readfile_1 = require("../readfile");
var linesOrig = (0, readfile_1.readLines)("./1/input-a.txt").map(function (s) { return parseInt(s, 10); });
var lines1 = __spreadArray(__spreadArray([], linesOrig, true), [0, 0], false);
var lines2 = __spreadArray(__spreadArray([0], linesOrig, true), [0], false);
var lines3 = __spreadArray([0, 0], linesOrig, true);
console.log(lines1.length);
var lines = lines1
    .map(function (e, idx) { return [e, lines2[idx], lines3[idx]]; })
    .map(function (_a) {
    var a = _a[0], b = _a[1], c = _a[2];
    return a + b + c;
})
    .slice(2, -2);
console.log(lines.length);
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
