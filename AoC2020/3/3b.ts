import { parse } from "path/posix";
import { readLines } from "../readfile";

type Bit = 1 | 0;
type Word = Bit[];

const mapToNumArray = (line: string): Word => {
  const chars = line.split("");

  return chars.map((c: string): Bit => {
    const val = parseInt(c, 10);
    if (val !== 1 && val !== 0) throw "parse error";
    return val;
  });
};

const lines = readLines("./3/input.txt").map(mapToNumArray);

interface Sum {
  0: number;
  1: number;
}

type ChooseStrategy = (words: Word[], index: number) => number;

const oxyStrat: ChooseStrategy = (words: Word[], index: number): number => {
  const sum = words.reduce(
    (acc: Sum, word: Word): Sum => {
      const value = word[index];
      acc[value] += 1;
      return acc;
    },
    { 0: 0, 1: 0 }
  );

  if (sum[0] > sum[1]) return 0;
  return 1;
};

const co2strat: ChooseStrategy = (words: Word[], index: number): number => {
  const sum = words.reduce(
    (acc: Sum, word: Word): Sum => {
      const value = word[index];
      acc[value] += 1;
      return acc;
    },
    { 0: 0, 1: 0 }
  );

  if (sum[0] <= sum[1]) return 0;
  return 1;
};

const asd = (words: Word[], strat: ChooseStrategy): Word => {
  const rec = (words: Word[], index: number): Word => {
    if (words.length === 1) return words[0];

    const filterVal = strat(words, index);
    const newWords = words.filter((word) => word[index] === filterVal);
    return rec(newWords, index + 1);
  };

  return rec(words, 0);
};

const wordToNum = (word: Word): number => {
  if (word.length == 1) {
    return word[0];
  }
  const head = word[0];
  const tail = word.slice(1);

  return (head << tail.length) + wordToNum(tail);
};

const oxy = wordToNum(asd(lines, oxyStrat));
const co2 = wordToNum(asd(lines, co2strat));
console.log(oxy);
console.log(co2);

console.log(oxy * co2);
