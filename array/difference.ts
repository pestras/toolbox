import { getSet } from "./get-set";

export function difference(arr1: any[], arr2: any[], base?: string, set?: boolean): any[] {
  let result = [].concat(arr1);

  for (let i = 0; i < arr2.length; i++) {
    let index = base ? result.findIndex(entry => entry[base] === arr2[i][base]) : result.indexOf(arr2[i]);

    if (index === -1) {
      result.push(arr2[i]);

    } else {
      result.splice(index, 1);
    }
  }

  return set ? getSet(result) : result;
}