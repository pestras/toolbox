export function similers(arr1: any[], arr2: any[], base?: string): any[] {
  let arr3: any[] = [];

  for (let i = 0; i < arr1.length; i++) {

    for (let j = 0; j < arr2.length; j++) {

      if (base && arr1[i][base] === arr2[j].base) {
        arr3.push(arr1[i]);
        break;
      } else if (arr1[i] === arr2[j]) {
        arr3.push(arr1[i]);
        break;
      }
    }
  }

  return arr3;
}