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
var lines = (0, readfile_1.readLines)("./6/input.txt");
var isFish = function (num) {
    if (num >= 0 && num <= 8) {
        return true;
    }
    return false;
};
var school = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0
};
var addFish = function (school, fish) {
    var _a;
    return (__assign(__assign({}, school), (_a = {}, _a[fish] = school[fish] + 1, _a)));
};
var parseFish = function (line) {
    return line.split(",").map(function (c) {
        var value = parseInt(c);
        if (isFish(value)) {
            return value;
        }
        throw "Not a fish";
    });
};
var tickSchool = function (school) {
    return {
        0: school[1],
        1: school[2],
        2: school[3],
        3: school[4],
        4: school[5],
        5: school[6],
        6: school[0] + school[7],
        7: school[8],
        8: school[0]
    };
};
var sumSchool = function (school) {
    return Object.values(school).reduce(function (acc, fish) { return acc + fish; }, 0);
};
var tickSchoolDays = function (school, amount) {
    if (amount === 0)
        return school;
    return tickSchoolDays(tickSchool(school), amount - 1);
};
var fishs = parseFish(lines[0]);
var schoolPrime = fishs.reduce(addFish, school);
console.log(sumSchool(tickSchoolDays(schoolPrime, 256)));
