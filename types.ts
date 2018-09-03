import { capitalizeFirst } from "./string/capitalize-first";

const typesMap = {
  list: [Number, Boolean, String, Date, RegExp, Object, Array, Function],
  values: ['number', 'boolean', 'string', 'date', 'regexp', 'object', 'array', 'function']
};

const typesList: string[] = ['number', 'int', 'float', 'string', 'boolean', 'primitive', 'date', 'regexp', 'function', 'object'];
// 'number[]', 'int[]', 'float[]', 'string[]', 'boolean[]', 'primitive[]', 'date[]', 'regexp[]', 'function[]', 'object[]', 'array', 'any'

function searchMap(value: string) {
  if (typeof value === "function") {
    let index = typesList.indexOf(value);

    if (index > -1)
      return typesMap.values[index];
  } else if (Array.isArray(value) && value.length === 1 && typeof value[0] === 'function') {
    let index = typesList.indexOf(value[0]);

    if (index > -1)
      return typesMap.values[index] + '[]';
  }

  return null;
}

function searchReverseMap(values: string[]): any[] {
  let result = [];
  for (let value of values) {
    let index = typesMap.values.indexOf(value);
    if (index > -1)
      result.push(typesMap.list[index]);
  }

  return result;
}

export class Types {

  static isValidType(type: string): boolean {
    return typesList.indexOf(type) > -1;
  }

  static isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  static isInt(value: any): boolean {
    return (Types.isNumber(value) && ("" + value).indexOf('.') === -1);
  }

  static isFloat(value: any): boolean {
    return (Types.isNumber(value) && ("" + value).indexOf('.') > -1);
  }

  static isString(value: any): boolean {
    return typeof value === 'string';
  }

  static isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  static isPrimitive(value: any): boolean {
    return (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean');
  }

  static isDate(value: any): boolean {
    return value instanceof Date;
  }

  static isRegExp(value: any): boolean {
    return value instanceof RegExp;
  }

  static isFunction(value: any): boolean {
    return typeof value === 'function';
  }

  static isObject(value: any): boolean {
    return value && typeof value === "object" && value.toString() === "[object Object]";
  }

  static isArray(value: any): boolean {
    return Array.isArray(value);
  }

  static isArrayOf(type: string, value: any[]): boolean {
    let lng = type.length;

    if (type.charAt(lng - 1) === 's')
      type = type.slice(0, lng - 1);

    if (Types.isValidType(type) && Array.isArray(value))
      return value.every((entry: any) => (<any>Types)[`is${capitalizeFirst(type)}`](entry));

    return false;
  }

  static getTypesOf(value: any): string[] {
    let types = ['any'];
    if (Array.isArray(value)) {
      for (let i = 0; i < typesList.length; i++)
        if ((<any>Types)[capitalizeFirst(typesList[i])](value))
          types.push(typesList[i]);
    } else {
      types.push('array', 'any[]');
      for (let i = 0; i < typesList.length; i++)
        if (Types.isArrayOf(typesList[i], value))
          types.push(typesList[i] + '[]');

      if (Array.isArray(value) && Types.isObject(value[0]))
        types.push(value[0].constructor.name + '[]');
    }

    types.push(...searchReverseMap(types));

    if (types.indexOf("object") > -1) {
      types.push(value.constructor);
      types.push(value.constructor.name);
    }

    return types;
  }
}