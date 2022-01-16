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
function transpose(a) {
    return a[0].map(function (_inner, idx) {
        return a.map(function (inner) {
            return inner[idx];
        });
    });
}
var lines = (0, readfile_1.readLines)("./3/input.txt");
var bitSets = transpose(lines.map(mapToNumArray));
var sums = bitSets.map(function (bits) {
    return bits.reduce(function (acc, bit) {
        acc[bit] += 1;
        return acc;
    }, { 0: 0, 1: 0 });
});
var maxStrategy = function (sum) {
    if (sum[0] > sum[1]) {
        return 0;
    }
    else {
        return 1;
    }
};
var minStrategy = function (sum) {
    if (sum[0] > sum[1]) {
        return 1;
    }
    else {
        return 0;
    }
};
var sumsToNum = function (sums, strat) {
    if (sums.length == 1) {
        return strat(sums[0]);
    }
    var head = sums[0];
    var tail = sums.slice(1);
    return (strat(head) << tail.length) + sumsToNum(tail, strat);
};
var gamma = sumsToNum(sums, maxStrategy);
var epsi = sumsToNum(sums, minStrategy);
console.log(gamma * epsi);
// console.log(transpose(lines.map(mapToNumArray)));
