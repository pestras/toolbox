import { getSet } from "./get-set";

export function subtract(arr1: any[], arr2: any[], base?: string, set?: boolean): any[] {
  let result: any[] = [...arr1];
  let x = 0;;

  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (base && arr1[i][base] === arr2[j].base) {
        result.splice(i - x, 1);
        x++;
        break;
      } else if (arr1[i] === arr2[j]) {
        result.splice(i - x, 1);
        x++
        break;
      }
    }
  }
  
  return set ? getSet(result) : result;
}