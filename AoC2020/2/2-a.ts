import { readLines } from "../readfile";

interface Position {
  horisontal: number;
  depth: number;
}

type Instruction = "forward" | "down" | "up";
type Command = [Instruction, number];

const lines = readLines("./2/input-a.txt");
const commands: Command[] = lines.map((line) => {
  const [ins, val] = line.split(" ");
  if (ins !== "forward" && ins !== "down" && ins !== "up") throw ins;
  return [ins, parseInt(val)];
});

const subMarine: Position = {
  horisontal: 0,
  depth: 0,
};

const location = commands.reduce((sub, command): Position => {
  switch (command[0]) {
    case "forward":
      return {
        ...sub,
        horisontal: sub.horisontal + command[1],
      };
    case "down":
      return {
        ...sub,
        depth: sub.depth + command[1],
      };
    case "up": {
      return {
        ...sub,
        depth: sub.depth - command[1],
      };
    }
  }
}, subMarine);

console.log(location);
console.log(location.depth * location.horisontal);
