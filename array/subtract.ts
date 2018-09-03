export function subtract(arr1: any[], arr2: any[], base?: string): any[] {
  let arr3: any[] = [...arr1];
  let x = 0;;

  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (base && arr1[i][base] === arr2[j].base) {
        arr3.splice(i - x, 1);
        x++;
        break;
      } else if (arr1[i] === arr2[j]) {
        arr3.splice(i - x, 1);
        x++
        break;
      }
    }
  }

  return arr3;
}