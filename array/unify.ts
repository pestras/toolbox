export function unify(arr1: any[], arr2: any[], base?: string): any[] {
  let arr3 = [...arr2];
  let inn: boolean;

  for (let i = 0; i < arr1.length; i++) {
    inn = false;

    for (let j = 0; j < arr2.length; j++) {

      if (base && arr1[i][base] === arr2[j].base) {
        inn = true;
        break;
      } else if (arr1[i] === arr2[j]) {
        inn = true;
        break;
      }
    }

    if (!inn) {
      arr3.push(arr1[i]);
      continue;
    }

    inn = false;
  }

  return arr3;
}