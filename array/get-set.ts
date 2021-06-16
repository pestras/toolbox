export function getSet(arr: any[], base?: string) {
  if (!base) return Array.from(new Set(arr));

  let result: any[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (result.findIndex(entity => entity[base] === arr[i][base]) === -1)
      result.push(arr[i]);
  }

  return result;
}