import {chunk} from "lodash";
import {readLines} from "../readfile";

const lines = readLines("./6/input.txt");

type Days = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type Fish = Days;

type School = Record<Days, number>;

const isFish = (num: number): num is Fish => {
  if (num >= 0 && num <= 8) {
    return true;
  }
  return false;
};

const school: School = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
};

const addFish = (school: School, fish: Fish): School => ({
  ...school,
  [fish]: school[fish] + 1,
});

const parseFish = (line: string): Fish[] => {
  return line.split(",").map((c: string): Fish => {
    const value = parseInt(c);
    if (isFish(value)) {
      return value;
    }
    throw "Not a fish";
  });
};

const tickSchool = (school: School): School => {
  return {
    0: school[1],
    1: school[2],
    2: school[3],
    3: school[4],
    4: school[5],
    5: school[6],
    6: school[0] + school[7],
    7: school[8],
    8: school[0],
  };
};

const sumSchool = (school: School): number => {
  return Object.values(school).reduce(
    (acc: number, fish: number): number => acc + fish,
    0
  );
};

const tickSchoolDays = (school: School, amount: number): School => {
  if (amount === 0) return school;
  return tickSchoolDays(tickSchool(school), amount - 1);
};

const fishs = parseFish(lines[0]);

const schoolPrime = fishs.reduce(addFish, school);
console.log(sumSchool(tickSchoolDays(schoolPrime, 256)));
