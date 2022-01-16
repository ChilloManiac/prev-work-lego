"use strict";
exports.__esModule = true;
var lodash_1 = require("lodash");
var readfile_1 = require("../readfile");
var inputLines = (0, readfile_1.readLines)("./5/input.txt");
var subPoint = function (lhs, rhs) { return ({
    x: lhs.x - rhs.x,
    y: lhs.y - rhs.y
}); };
var addPoint = function (lhs, rhs) { return ({
    x: lhs.x + rhs.x,
    y: lhs.y + rhs.y
}); };
var isEqual = function (lhs, rhs) {
    return lhs.x === rhs.x && rhs.y === lhs.y;
};
var getUnitVector = function (point) {
    var absX = Math.abs(point.x);
    var absY = Math.abs(point.y);
    return {
        x: point.x === 0 ? 0 : point.x / absX,
        y: point.y === 0 ? 0 : point.y / absY
    };
};
var parsePair = function (pair) {
    console.log(pair);
    var _a = pair.split(","), x = _a[0], y = _a[1];
    return { x: parseInt(x), y: parseInt(y) };
};
var parseLine = function (line) {
    var _a = line.split(" -> "), fromStr = _a[0], toStr = _a[1];
    return {
        from: parsePair(fromStr),
        to: parsePair(toStr)
    };
};
var stepTowards = function (from, to) {
    var direction = subPoint(to, from);
    return addPoint(from, getUnitVector(direction));
};
var Grid = /** @class */ (function () {
    function Grid(width, height) {
        this.width = width;
        this.height = height;
        this.grid = new Array(width * height).fill(0);
    }
    Grid.prototype.addLine = function (line) {
        if (line.from.x !== line.to.x && line.from.y !== line.to.y)
            return;
        var pos = line.from;
        this.grid[this.pointToIndex(pos)] += 1;
        while (!isEqual(pos, line.to)) {
            pos = stepTowards(pos, line.to);
            this.grid[this.pointToIndex(pos)] += 1;
        }
    };
    Grid.prototype.pointToIndex = function (point) {
        return point.y * this.width + point.x;
    };
    Grid.prototype.print = function () {
        var chunks = (0, lodash_1.chunk)(this.grid, this.width);
        var lines = chunks.map(function (numbers) {
            return numbers.reduce(function (str, num) {
                return str + (num === 0 ? "." : num.toString());
            }, "");
        });
        lines.forEach(function (line) { return console.log(line); });
    };
    Grid.prototype.getScore = function () {
        return this.grid.filter(function (num) { return num >= 2; }).length;
    };
    return Grid;
}());
var lines = inputLines.map(parseLine);
var grid = new Grid(1000, 1000);
var gridPrime = lines.reduce(function (grid, line) {
    grid.addLine(line);
    return grid;
}, grid);
// gridPrime.print();
console.log(gridPrime.getScore());
