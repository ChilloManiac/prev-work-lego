type Board = { [key: string]: { x: number; y: number } };

export const parseBoard = (board: string): Board => {
  const parseLine = (line: string, y: number) =>
    line
      .split(" ")
      .filter((s) => s)
      .map((digit, x) => [digit, { x, y }]);
  const entries = board.split("\n").flatMap(parseLine);
  return Object.fromEntries(entries);
};

export const parse = (input: string) => {
  const [digits, ...boards] = input.trim().split("\n\n");
  return {
    digits: digits.split(","),
    boards: boards.map(parseBoard),
  };
};

const initFilledBoardLine = (): { [key: string]: string[] } =>
  Object.fromEntries([...Array(5)].map((_, index) => [index.toString(), []]));

const findWinner = (digits: string[], boards: Board[]): [number, string[]] => {
  const filledBoards = boards.map(() => ({
    x: initFilledBoardLine(),
    y: initFilledBoardLine(),
  }));

  const boardsAmount = boards.length;

  for (const digit of digits) {
    for (let index = 0; index < boardsAmount; index++) {
      const board = boards[index];
      if (!board[digit]) {
        continue;
      }

      const filledBoard = filledBoards[index];
      const { x, y } = board[digit];

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

const calsFinalScore = (digits: string[], board: Board, winRow: string[]) => {
  const lastDigit = winRow[winRow.length - 1];
  const row = digits.slice(0, digits.indexOf(lastDigit) + 1);

  const sumOfUnmarketNumbers = Object.keys(board)
    .filter((d) => !row.includes(d))
    .map((d) => parseInt(d))
    .reduce((a, b) => a + b, 0);

  return sumOfUnmarketNumbers * parseInt(lastDigit);
};

export const first = (input: string) => {
  const { digits, boards } = parse(input);
  const [boardIndex, row] = findWinner(digits, boards);
  return calsFinalScore(digits, boards[boardIndex], row);
};

export const findLastWonBoard = (
  digits: string[],
  _boards: Board[]
): [Board, string[]] => {
  const boards = [..._boards];
  while (true) {
    const [index, winRow] = findWinner(digits, boards);
    const [board] = boards.splice(index, 1);

    if (boards.length === 0) {
      return [board, winRow];
    }
  }
};

export const second = (input: string) => {
  const { digits, boards } = parse(input);
  const [board, row] = findLastWonBoard(digits, boards);
  console.log(board);
  console.log(row);
  return calsFinalScore(digits, board, row);
};

import * as fs from "fs";

export function readLines(path: string): string {
  const file = fs.readFileSync(path, "utf-8");
  return file;
}

console.log(second(readLines("./4/input.txt")));
