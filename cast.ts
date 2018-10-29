import { Types } from "./types";

export function cast(val: any, type: 'boolean' | 'string' | 'number' | 'date' | 'regexp' | 'array'): boolean | string | number | Date | RegExp | any[] {
  let valueType = Types.getTypesOf(val);

  if (type === 'boolean')
    return !!val;

  if (type === 'number') {
    if (Types.isPrimitive(val)) {
      val = +val;

      if (val === NaN)
        throw "can't cast NaN to number!";

      return val;

    } else {
      throw `can't cast non primitive value to number!`;
    }
  }

  if (type === 'string') {
    if (Types.isPrimitive(val) || Types.isDate(val) || Types.isRegExp(val) || Types.isFunction(val))
      return "" + val;
    else if (Types.isObject(val) || Array.isArray(val))
      return JSON.stringify(val);
  }

  if (type === 'date') {
    if (Types.isNumber(val) || Types.isString(val)) {
      let d = new Date(val);

      if (d.toString() === "Invalid Date")
        throw "can't cast value to a date!";

      return d;
    }

    if (Types.isDate(val))
      return val;

    throw "can't cast value to a date!";
  }

  if (type === "regexp") {
    if (Types.isPrimitive(val))
      return new RegExp(val);

    if (Types.isRegExp(val))
      return val;

    throw "can't cast value to a regexp!";
  }

  if (type === 'array')
    return Array.isArray(val) ? val : [val];

  throw `unsupported type ${type}`;
}