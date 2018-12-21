import { getSet } from "./get-set";

export function similers(arr1: any[], arr2: any[], base?: string, set?: boolean): any[] {
  let result: any[] = [];

  for (let i = 0; i < arr1.length; i++) {

    for (let j = 0; j < arr2.length; j++) {

      if (base && arr1[i][base] === arr2[j].base) {
        result.push(arr1[i]);
        break;
      } else if (arr1[i] === arr2[j]) {
        result.push(arr1[i]);
        break;
      }
    }
  }

  return set ? getSet(result) : result;
}