import { IObject } from "./";
import { cleanPropPath } from "./clean-prop-path";

export function pick(obj: IObject, props: string[]): any {
  let result: any = {};
  for (let i = 0; i < props.length; i++) {
    let path = cleanPropPath(props[i]).split('.');

    if (path.length === 1) {
      result[props[i]] = obj[props[i]];
      continue;
    }

    result[path[0]] = result[path[0]] || {};
    let temp = result;
    let currentvalue = obj[path[0]];

    if (currentvalue === undefined) {
      result[path[0]] = null;
      continue;
    }

    for (let j = 1; j < path.length; j++) {
      currentvalue = currentvalue[path[j]];

      if (!currentvalue)
        break;

      if (j === path.length - 1) {
        temp[path[j - 1]][path[j]] = currentvalue;
        break;
      }

      temp[path[j - 1]][path[j]] = temp[path[j - 1]][j] || {};
      temp = temp[path[j - 1]];
    }
  }

  return result;
}