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
exports.readLines = exports.second = exports.findLastWonBoard = exports.first = exports.parse = exports.parseBoard = void 0;
var parseBoard = function (board) {
    var parseLine = function (line, y) {
        return line
            .split(" ")
            .filter(function (s) { return s; })
            .map(function (digit, x) { return [digit, { x: x, y: y }]; });
    };
    var entries = board.split("\n").flatMap(parseLine);
    return Object.fromEntries(entries);
};
exports.parseBoard = parseBoard;
var parse = function (input) {
    var _a = input.trim().split("\n\n"), digits = _a[0], boards = _a.slice(1);
    return {
        digits: digits.split(","),
        boards: boards.map(exports.parseBoard)
    };
};
exports.parse = parse;
var initFilledBoardLine = function () {
    return Object.fromEntries(__spreadArray([], Array(5), true).map(function (_, index) { return [index.toString(), []]; }));
};
var findWinner = function (digits, boards) {
    var filledBoards = boards.map(function () { return ({
        x: initFilledBoardLine(),
        y: initFilledBoardLine()
    }); });
    var boardsAmount = boards.length;
    for (var _i = 0, digits_1 = digits; _i < digits_1.length; _i++) {
        var digit = digits_1[_i];
        for (var index = 0; index < boardsAmount; index++) {
            var board = boards[index];
            if (!board[digit]) {
                continue;
            }
            var filledBoard = filledBoards[index];
            var _a = board[digit], x = _a.x, y = _a.y;
            filledBoard.x[x].push(digit);
            filledBoard.y[y].push(digit);
            if (filledBoard.x[x].length === 5) {
                return [index, filledBoard.x[x]];
            }
            if (filledBoard.y[y].length === 5) {
                return [index, filledBoard.y[y]];
            }
        }
    }
    return [Number.NaN, []];
};
var calsFinalScore = function (digits, board, winRow) {
    var lastDigit = winRow[winRow.length - 1];
    var row = digits.slice(0, digits.indexOf(lastDigit) + 1);
    var sumOfUnmarketNumbers = Object.keys(board)
        .filter(function (d) { return !row.includes(d); })
        .map(function (d) { return parseInt(d); })
        .reduce(function (a, b) { return a + b; }, 0);
    return sumOfUnmarketNumbers * parseInt(lastDigit);
};
var first = function (input) {
    var _a = (0, exports.parse)(input), digits = _a.digits, boards = _a.boards;
    var _b = findWinner(digits, boards), boardIndex = _b[0], row = _b[1];
    return calsFinalScore(digits, boards[boardIndex], row);
};
exports.first = first;
var findLastWonBoard = function (digits, _boards) {
    var boards = __spreadArray([], _boards, true);
    while (true) {
        var _a = findWinner(digits, boards), index = _a[0], winRow = _a[1];
        var board = boards.splice(index, 1)[0];
        if (boards.length === 0) {
            return [board, winRow];
        }
    }
};
exports.findLastWonBoard = findLastWonBoard;
var second = function (input) {
    var _a = (0, exports.parse)(input), digits = _a.digits, boards = _a.boards;
    var _b = (0, exports.findLastWonBoard)(digits, boards), board = _b[0], row = _b[1];
    console.log(board);
    console.log(row);
    return calsFinalScore(digits, board, row);
};
exports.second = second;
var fs = require("fs");
function readLines(path) {
    var file = fs.readFileSync(path, "utf-8");
    return file;
}
exports.readLines = readLines;
console.log((0, exports.second)(readLines("./4/input.txt")));
