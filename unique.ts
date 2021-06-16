import { randomStr, RandomStringType } from "./string/random";

let repo: any[] = [];

function genCode(type?: [RandomStringType?, RandomStringType?, RandomStringType?, RandomStringType?], length?: number) {
  let code: string;

  while (true) {
    code = randomStr(length, type);

    if (repo.indexOf(code) === -1) {
      repo.push(code);
      break;
    }
  }

  return code;
}

export class Unique {
  static Get(type?: [RandomStringType?, RandomStringType?, RandomStringType?, RandomStringType?], length?: number) {
    return genCode(type, length);
  }
  
  static Clear() {
    repo = [];
  }
}