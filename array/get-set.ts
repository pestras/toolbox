export function getSet(arr: any[], base?: string) {
  let result: any[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (base) {
      if (result.findIndex(entity => entity[base] === arr[i][base]) > -1)
        continue;
    } else if (result.indexOf(arr[i]) > -1) {
      continue;
    }

    result.push(arr[i]);
  }
  
  return result;
}