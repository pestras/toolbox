import { getValue } from './get-value';
import { injectValue } from "./inject-value";

export function objFromMap(src: any, target: any = {}, map: any, options: { ignoreKeys?: boolean, prefix?: string } = {}) {
  options.ignoreKeys = !!options.ignoreKeys;
  options.prefix = options.prefix || '$';

  if (!map)
    return map;

  if (typeof map === 'object') {
    let value;

    if (Array.isArray(map)) {
      target = Array.isArray(target) ? target : [];

      if (map.length === 0)
        return [];

      for (let i = 0; i < map.length; i++) {

        if (typeof map[i] === 'string' && map[i].indexOf(`.${options.prefix}`) === 0) {
          value = getValue(src, map[i].slice(2));

          if (Array.isArray(value) && value.length)
            target.push(...value);

        } else {
          value = objFromMap(src, null, map[i], options);

          if (value !== undefined)
            target.push(value);
        }
      }

    } else {
      if (map.constructor.name !== 'Object') {
        target = map;

      } else {
        target = target || {};

        for (let prop in map)
          options.ignoreKeys
            ? target[prop] = objFromMap(src, null, map[prop], options)
            : injectValue(target, prop, objFromMap(src, null, map[prop], options));

      }
    }

  } else {

    if (typeof map === 'string') {
      if (map.charAt(0) === `${options.prefix}`) {
        let toString = map.charAt(1) === `${options.prefix}`;
        let path = toString ? map.slice(2) : map.slice(1);
        let value = getValue(src, path);

        target = toString ? value.toString() : value;

      } else if (map.indexOf(`\\${options.prefix}`) === 0) {
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