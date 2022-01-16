import { readLines } from "../readfile";
import { zip } from "lodash";

const linesOrig = readLines("./1/input-a.txt").map((s) => parseInt(s, 10));

const lines1 = [...linesOrig, 0, 0];
const lines2 = [0, ...linesOrig, 0];
const lines3 = [0, 0, ...linesOrig];

console.log(lines1.length);

const lines = lines1
  .map((e, idx) => [e, lines2[idx], lines3[idx]])
  .map(([a, b, c]) => a + b + c)
  .slice(2, -2);

console.log(lines.length);

let count = 0;
let previous = Infinity;
for (const line of lines) {
  if (line > previous) {
    count++;
  }
  previous = line;
}

console.log(count);
