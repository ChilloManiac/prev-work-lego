import { chunk } from "lodash";
import { readLines } from "../readfile";

const inputLines = readLines("./5/input.txt");

interface Point {
  x: number;
  y: number;
}

interface Line {
  from: Point;
  to: Point;
}

const subPoint = (lhs: Point, rhs: Point): Point => ({
  x: lhs.x - rhs.x,
  y: lhs.y - rhs.y,
});
const addPoint = (lhs: Point, rhs: Point): Point => ({
  x: lhs.x + rhs.x,
  y: lhs.y + rhs.y,
});

const isEqual = (lhs: Point, rhs: Point): boolean =>
  lhs.x === rhs.x && rhs.y === lhs.y;

const getUnitVector = (point: Point): Point => {
  const absX = Math.abs(point.x);
  const absY = Math.abs(point.y);

  return {
    x: point.x === 0 ? 0 : point.x / absX,
    y: point.y === 0 ? 0 : point.y / absY,
  };
};

const parsePair = (pair: string): Point => {
  const [x, y] = pair.split(",");
  return { x: parseInt(x), y: parseInt(y) };
};

const parseLine = (line: string): Line => {
  const [fromStr, toStr] = line.split(" -> ");
  return {
    from: parsePair(fromStr),
    to: parsePair(toStr),
  };
};

const stepTowards = (from: Point, to: Point): Point => {
  const direction = subPoint(to, from);
  return addPoint(from, getUnitVector(direction));
};

class Grid {
  private width: number;
  private height: number;
  private grid: number[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.grid = new Array<number>(width * height).fill(0);
  }

  addLine(line: Line) {
    // if (line.from.x !== line.to.x && line.from.y !== line.to.y) return;

    let pos: Point = line.from;
    this.grid[this.pointToIndex(pos)] += 1;
    while (!isEqual(pos, line.to)) {
      pos = stepTowards(pos, line.to);
      this.grid[this.pointToIndex(pos)] += 1;
    }
  }

  private pointToIndex(point: Point): number {
    return point.y * this.width + point.x;
  }

  public print() {
    const chunks = chunk(this.grid, this.width);
    const lines = chunks.map((numbers: number[]) => {
      return numbers.reduce((str: string, num: number) => {
        return str + (num === 0 ? "." : num.toString());
      }, "");
    });

    lines.forEach((line) => console.log(line));
  }

  public getScore(): number {
    return this.grid.filter((num) => num >= 2).length;
  }
}

const lines = inputLines.map(parseLine);
const grid = new Grid(1000, 1000);

const gridPrime = lines.reduce((grid: Grid, line: Line): Grid => {
  grid.addLine(line);
  return grid;
}, grid);

// gridPrime.print();
console.log(gridPrime.getScore());
