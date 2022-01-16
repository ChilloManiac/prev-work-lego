"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var readfile_1 = require("../readfile");
var lines = (0, readfile_1.readLines)("./2/input-a.txt");
var commands = lines.map(function (line) {
    var _a = line.split(" "), ins = _a[0], val = _a[1];
    if (ins !== "forward" && ins !== "down" && ins !== "up")
        throw ins;
    return [ins, parseInt(val)];
});
var subMarine = {
    horisontal: 0,
    depth: 0,
    aim: 0
};
var location = commands.reduce(function (sub, command) {
    switch (command[0]) {
        case "forward":
            return __assign(__assign({}, sub), { horisontal: sub.horisontal + command[1], depth: sub.depth + sub.aim * command[1] });
        case "down":
            return __assign(__assign({}, sub), { aim: sub.aim + command[1] });
        case "up": {
            return __assign(__assign({}, sub), { aim: sub.aim - command[1] });
        }
    }
}, subMarine);
console.log(location);
console.log(location.depth * location.horisontal);
