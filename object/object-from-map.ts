import { getValue } from './get-value';
import { injectValue } from "./inject-value";

export function objFromMap(src: any, target: any = {}, map: any) {

  if (!map)
    return null;

  if (typeof map === 'object') {
    let value;

    if (Array.isArray(map)) {
      target = Array.isArray(target) ? target : [];

      if (map.length === 0)
        return [];

      for (let prop of map) {

        if (prop.indexOf('.$') === 0) {
          value = getValue(src, prop.slice(2));

          if (Array.isArray(value) && value.length)
            target.push(...value);

        } else {
          value = objFromMap(src, null, prop);

          if (value !== undefined)
            target.push(value);
        }
      }

    } else {

      for (let prop in map) {
        injectValue(target, prop, objFromMap(src, null, map[prop]));
      }
    }

  } else {

    if (typeof map === 'string') {
      if (map.charAt(0) === '$') {
        let toString = map.charAt(1) === '$';
        let path = toString ? map.slice(2) : map.slice(1);
        let value = getValue(src, path);

        target = toString ? value.toString() : value;

      } else if (map.indexOf('\$') === 0) {
        target = map.slice(1);

      } else {
        target = map;
      }

    } else {
      target = map;
    }
  }

  return target;
}