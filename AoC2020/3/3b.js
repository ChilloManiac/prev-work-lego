"use strict";
exports.__esModule = true;
var readfile_1 = require("../readfile");
var mapToNumArray = function (line) {
    var chars = line.split("");
    return chars.map(function (c) {
        var val = parseInt(c, 10);
        if (val !== 1 && val !== 0)
            throw "parse error";
        return val;
    });
};
var lines = (0, readfile_1.readLines)("./3/input.txt").map(mapToNumArray);
var oxyStrat = function (words, index) {
    var sum = words.reduce(function (acc, word) {
        var value = word[index];
        acc[value] += 1;
        return acc;
    }, { 0: 0, 1: 0 });
    if (sum[0] > sum[1])
        return 0;
    return 1;
};
var co2strat = function (words, index) {
    var sum = words.reduce(function (acc, word) {
        var value = word[index];
        acc[value] += 1;
        return acc;
    }, { 0: 0, 1: 0 });
    if (sum[0] <= sum[1])
        return 0;
    return 1;
};
var asd = function (words, strat) {
    var rec = function (words, index) {
        if (words.length === 1)
            return words[0];
        var filterVal = strat(words, index);
        var newWords = words.filter(function (word) { return word[index] === filterVal; });
        return rec(newWords, index + 1);
    };
    return rec(words, 0);
};
var wordToNum = function (word) {
    if (word.length == 1) {
        return word[0];
    }
    var head = word[0];
    var tail = word.slice(1);
    return (head << tail.length) + wordToNum(tail);
};
var oxy = wordToNum(asd(lines, oxyStrat));
var co2 = wordToNum(asd(lines, co2strat));
console.log(oxy);
console.log(co2);
console.log(oxy * co2);
