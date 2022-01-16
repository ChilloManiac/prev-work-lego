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

function transpose<T>(a: T[][]): T[][] {
  return a[0].map((_inner: T, idx: number) => {
    return a.map((inner: T[]) => {
      return inner[idx];
    });
  });
}

const lines = readLines("./3/input.txt");

const bitSets: Bit[][] = transpose(lines.map(mapToNumArray));

interface Sum {
  0: number;
  1: number;
}

const sums: Sum[] = bitSets.map((bits: Bit[]): Sum => {
  return bits.reduce(
    (acc: Sum, bit: Bit): Sum => {
      acc[bit] += 1;
      return acc;
    },
    { 0: 0, 1: 0 }
  );
});

type SumStrategy = (sum: Sum) => number;

const maxStrategy: SumStrategy = (sum: Sum) => {
  if (sum[0] > sum[1]) {
    return 0;
  } else {
    return 1;
  }
};

const minStrategy: SumStrategy = (sum: Sum) => {
  if (sum[0] > sum[1]) {
    return 1;
  } else {
    return 0;
  }
};

const sumsToNum = (sums: Sum[], strat: SumStrategy): number => {
  if (sums.length == 1) {
    return strat(sums[0]);
  }
  const head = sums[0];
  const tail = sums.slice(1);

  return (strat(head) << tail.length) + sumsToNum(tail, strat);
};

const gamma = sumsToNum(sums, maxStrategy);
const epsi = sumsToNum(sums, minStrategy);

console.log(gamma * epsi);

// console.log(transpose(lines.map(mapToNumArray)));
