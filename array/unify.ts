import { getSet } from "./get-set";

export function unify(arr1: any[], arr2: any[], base?: string): any[] {
  if (!base)  return Array.from(new Set(arr1.concat(arr2)));

  let result = [...arr2];
  let inn: boolean;


  for (let i = 0; i < arr1.length; i++) {
    inn = false;

    for (let j = 0; j < arr2.length; j++) {

      if (arr1[i][base] === arr2[j].base) {
        inn = true;
        break;
      }
    }

    if (!inn) {
      result.push(arr1[i]);
      continue;
    }

    inn = false;
  }

  return getSet(result);
}