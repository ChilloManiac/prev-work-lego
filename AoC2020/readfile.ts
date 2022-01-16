import * as fs from "fs";

export function readLines(path: string): string[] {
  const file = fs.readFileSync(path, "utf-8");
  return file.split("\n");
}
