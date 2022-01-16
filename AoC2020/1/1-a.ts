import { readLines } from "../readfile";

const lines = readLines("./1/input-a.txt").map((s) => parseInt(s, 10));

let count = 0;
let previous = Infinity;
for (const line of lines) {
  if (line > previous) {
    count++;
  }
  previous = line;
}

console.log(count);
