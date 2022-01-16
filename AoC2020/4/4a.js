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
var lodash_1 = require("lodash");
var lines = (0, readfile_1.readLines)("./4/input.txt");
var BingoBoard = /** @class */ (function () {
    function BingoBoard(board, size) {
        this.size = size;
        this.board = board;
        this.markings = new Array(board.length).fill(false);
    }
    BingoBoard.prototype.markNumber = function (num) {
        for (var idx in this.board) {
            if (num === this.board[idx]) {
                this.markings[idx] = true;
            }
        }
        return this.isWinner();
    };
    BingoBoard.prototype.isWinner = function () {
        for (var i = 0; i < this.size; i++) {
            var win = true;
            for (var j = 0; j < this.size; j++) {
                win = win && this.markings[i * this.size + j];
            }
            if (win)
                return true;
            win = true;
            for (var j = 0; j < this.size; j++) {
                win = win && this.markings[j * this.size + i];
            }
            if (win)
                return true;
        }
        return false;
    };
    BingoBoard.prototype.getScore = function () {
        var score = 0;
        for (var index in this.markings) {
            if (!this.markings[index])
                score += this.board[index];
        }
        return score;
    };
    return BingoBoard;
}());
var inputs = lines[0].split(",").map(function (s) { return parseInt(s, 10); });
var rest = lines.slice(1);
var boardStrings = (0, lodash_1.chunk)(rest, 6);
var stringToBoard = function (strs) {
    var trimmed = strs.slice(1);
    var numbers = trimmed.reduce(function (nums, str) {
        return __spreadArray(__spreadArray([], nums, true), str
            .replace("  ", " ")
            .split(" ")
            .filter(function (s) { return !!s; })
            .map(function (s) { return s.trim(); })
            .map(function (s) { return parseInt(s, 10); }), true);
    }, []);
    return new BingoBoard(numbers, trimmed.length);
};
var boards = boardStrings.map(stringToBoard);
var recurse = function (nums) {
    if (nums.length === 0)
        throw "fuck";
    var head = nums[0];
    var tail = nums.slice(1);
    for (var _i = 0, boards_1 = boards; _i < boards_1.length; _i++) {
        var board = boards_1[_i];
        if (board.markNumber(head))
            return [board, head];
    }
    return recurse(tail);
};
var _a = recurse(inputs), winner = _a[0], lastnum = _a[1];
console.log(winner);
console.log(lastnum * winner.getScore());
