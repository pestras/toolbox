import { IObject } from "./";

export function getChanges(obj1: IObject, obj2: IObject): { count: number, list: [any, any] } {
  let changes: { count: number, list: [any, any] } = { count: 0, list: [{}, {}] };

  if (obj1 === obj2)
    return changes;

  if ((typeof obj1 !== 'object' && typeof obj2 !== 'object') || (obj1 === null || obj2 === null)) {
    changes.list[0] = obj1;
    changes.list[1] = obj2;
    changes.count++;
    return changes;
  }

  let obj1Size = Object.keys(obj1).length;
  let obj2Size = Object.keys(obj2).length;

  if (obj1Size === 0 || obj2Size === 0)
    return changes;

  let ref1 = obj1Size >= obj2Size ? obj1 : obj2;
  let ref2 = obj1Size >= obj2Size ? obj2 : obj1;
  let swipe = ref1 === obj2;

  for (let prop in ref1) {
    if (ref2[prop] === ref1[prop])
      continue;

    if (!ref2.hasOwnProperty(prop)) {
      changes.list[swipe ? 1 : 0][prop] = ref1[prop];
      changes.count++;
      continue;
    }

    if (typeof ref1[prop] === 'object' && typeof ref2[prop] === 'object') {
      if (Array.isArray(ref1[prop])) {
        if (Array.isArray(ref2[prop])) {
          if (ref1[prop].length === ref2[prop].length) {
            changes.list[0][prop] = [];
            changes.list[1][prop] = [];
            for (let i = 0; i < ref1[prop].length; i++) {
              let subResults = getChanges(ref1[prop][i], ref2[prop][i]);
              if (subResults.count > 0) {
                changes.list[0][prop].push(swipe ? subResults.list[1] : subResults.list[0]);
                changes.list[1][prop].push(swipe ? subResults.list[0] : subResults.list[1]);
                changes.count++;
              }
            }

            if (changes.list[0][prop].length === 0) {
              delete changes.list[0][prop];
              delete changes.list[1][prop];
            }

            continue;
          }
        }

      } else {

        let subResults = getChanges(ref1[prop], ref2[prop]);
        if (subResults.count > 0) {
          changes.list[0][prop] = swipe ? subResults.list[1] : subResults.list[0];
          changes.list[1][prop] = swipe ? subResults.list[0] : subResults.list[1];
          changes.count++;
        }

        continue;
      }
    }

    changes.list[0][prop] = swipe ? ref2[prop] : ref1[prop];
    changes.list[1][prop] = swipe ? ref1[prop] : ref2[prop];
    changes.count++;
  }

  for (let prop in ref2) {
    if (!ref1.hasOwnProperty(prop)) {
      changes.list[swipe ? 0 : 1][prop] = ref2[prop];
      changes.count++;
    }
  }

  return changes;
}