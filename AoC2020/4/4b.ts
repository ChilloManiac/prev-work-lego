import { readLines } from "../readfile";
import { zip, chunk } from "lodash";

const lines = readLines("./4/input.txt");

class BingoBoard {
  private board: number[];
  private markings: boolean[];
  private size: number;

  constructor(board: number[], size: number) {
    this.size = size;
    this.board = board;
    this.markings = new Array<boolean>(board.length).fill(false);
  }

  public markNumber(num: number): boolean {
    for (const idx in this.board) {
      if (num === this.board[idx]) {
        this.markings[idx] = true;
      }
    }

    return this.isWinner();
  }

  private isWinner(): boolean {
    for (let i = 0; i < this.size; i++) {
      let win = true;
      for (let j = 0; j < this.size; j++) {
        win = win && this.markings[i * this.size + j];
      }
      if (win) return true;

      win = true;
      for (let j = 0; j < this.size; j++) {
        win = win && this.markings[j * this.size + i];
      }
      if (win) return true;
    }
    return false;
  }

  public print() {
    const comb = zip(this.board, this.markings);
    const chunked = chunk(comb, this.size);
    for (const line of chunked) {
      const l = line.map((li) => `${li[0]} ${li[1]}`);
      console.log(l);
    }
  }

  public getScore(): number {
    let score = 0;
    for (const index in this.markings) {
      if (!this.markings[index]) score += this.board[index];
    }
    return score;
  }
}

const inputs = lines[0].split(",").map((s) => parseInt(s, 10));
const rest = lines.slice(1);
const boardStrings = chunk(rest, 6);

const stringToBoard = (strs: string[]): BingoBoard => {
  const trimmed = strs.slice(1);
  const numbers = trimmed.reduce((nums: number[], str: string): number[] => {
    return [
      ...nums,
      ...str
        .replace("  ", " ")
        .split(" ")
        .filter((s) => !!s)
        .map((s) => s.trim())
        .map((s) => parseInt(s, 10)),
    ];
  }, []);

  return new BingoBoard(numbers, trimmed.length);
};

const boards = boardStrings.map(stringToBoard);

const recurse = (
  nums: number[],
  boards: BingoBoard[]
): [BingoBoard, number] => {
  if (nums.length === 0) throw "fuck";

  const head = nums[0];
  const tail = nums.slice(1);

  const wonIndex: string[] = [];

  for (const index in boards) {
    const board = boards[index];
    if (board.markNumber(head)) {
      if (boards.length - wonIndex.length === 1) return [board, head];
      wonIndex.push(index);
    }
  }

  const nextBoards = boards.filter((_, i) => !wonIndex.includes(i.toString()));

  return recurse(tail, nextBoards);
};

const [winner, lastnum] = recurse(inputs, boards);
console.log(lastnum);
console.log(winner.getScore());
console.log(lastnum * winner.getScore());
winner.print();
