import { Types } from "./types";

export function cast(val: any, type: 'boolean' | 'string' | 'number' | 'date' | 'regexp' | 'array'): boolean | string | number | Date | RegExp | any[] {

  if (type === 'boolean')
    return !!val;

  if (type === 'number') {
    if (Types.primitive(val)) {
      val = +val;

      if (isNaN(val))
        throw "can't cast NaN to number!";

      return val;

    } else {
      throw `can't cast non primitive value to number!`;
    }
  }

  if (type === 'string') {
    if (Types.primitive(val) || Types.date(val) || Types.regexp(val) || Types.function(val))
      return "" + val;
    else if (Types.object(val) || Array.isArray(val))
      return JSON.stringify(val);
  }

  if (type === 'date') {
    if (Types.number(val) || Types.string(val)) {
      let d = new Date(val);

      if (d.toString() === "Invalid Date")
        throw "can't cast value to a date!";

      return d;
    }

    if (Types.date(val))
      return val;

    throw "can't cast value to a date!";
  }

  if (type === "regexp") {
    if (Types.primitive(val))
      return new RegExp(val);

    if (Types.regexp(val))
      return val;

    throw "can't cast value to a regexp!";
  }

  if (type === 'array')
    return Array.isArray(val) ? val : [val];

  throw `unsupported type ${type}`;
}