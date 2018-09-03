import { IObject } from "./";

export function getChanges(obj1: IObject, obj2: IObject): { count: number, changes: [any, any]} {
  let results: any = { count: 0, changes: [{}, {}] };

  if (obj1 === obj2)
    return results;

  if ((typeof obj1 !== 'object' && typeof obj2 !== 'object') || (obj1 === null || obj2 === null)) {
    results.changes[0] = obj1;
    results.changes[1] = obj2;
    results.count++;
    return results;
  }

  let obj1Size = Object.keys(obj1).length;
  let obj2Size = Object.keys(obj2).length;

  if (obj1Size === 0 || obj2Size === 0)
    return results;

  let ref1 = obj1Size >= obj2Size ? obj1 : obj2;
  let ref2 = obj1Size >= obj2Size ? obj2 : obj1;
  let swipe = ref1 === obj2;

  for (let prop in ref1) {
    if (ref2[prop] === ref1[prop])
      continue;

    if (!ref2.hasOwnProperty(prop)) {
      results.changes[swipe ? 1 : 0][prop] = ref1[prop];
      results.count++;
      continue;
    }

    if (typeof ref1[prop] === 'object' && typeof ref2[prop] === 'object') {
      if (Array.isArray(ref1[prop])) {
        if (Array.isArray(ref2[prop])) {
          if (ref1[prop].length === ref2[prop].length) {
                results.changes[0][prop] = [];
                results.changes[1][prop] = [];
            for ( let i = 0; i < ref1[prop].length; i++) {
              let subResults = getChanges(ref1[prop][i], ref2[prop][i]);
              if (subResults.count > 0) {
                results.changes[0][prop].push(swipe ? subResults.changes[1] : subResults.changes[0]);
                results.changes[1][prop].push(swipe ? subResults.changes[0] : subResults.changes[1]);
                results.count++;
              }
            }

            if (results.changes[0][prop].length === 0) {
              delete results.changes[0][prop];
              delete results.changes[1][prop];
            }

            continue;
          }
        }

      } else {

        let subResults = getChanges(ref1[prop], ref2[prop]);
        if (subResults.count > 0) {
          results.changes[0][prop] = swipe ? subResults.changes[1] : subResults.changes[0];
          results.changes[1][prop] = swipe ? subResults.changes[0] : subResults.changes[1];
          results.count++;
        }

        continue;
      }
    }

    results.changes[0][prop] = swipe ? ref2[prop] : ref1[prop];
    results.changes[1][prop] = swipe ? ref1[prop] : ref2[prop];
    results.count++;
  }

  for (let prop in ref2) {
    if (!ref1.hasOwnProperty(prop)) {
      results.changes[swipe ? 0 : 1][prop] = ref2[prop];
      results.count++;
    }
  }

  return results;
}