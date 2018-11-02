import { capitalizeFirst } from "./string/capitalize-first";

const typesMap = {
  list: [Number, Boolean, String, Date, RegExp, Object, Array, Function],
  values: ['number', 'boolean', 'string', 'date', 'regexp', 'object', 'array', 'function']
};

const typesList = ['number', 'int', 'float', 'string', 'boolean', 'primitive', 'date', 'regexp', 'function', 'object', 'array'];
// 'number[]', 'int[]', 'float[]', 'string[]', 'boolean[]', 'primitive[]', 'date[]', 'regexp[]', 'function[]', 'object[]', 'array', 'any'

function searchMap(value: any) {
  if (typeof value === "function") {
    let index = typesMap.list.indexOf(value);

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

export const Types = {

  isValidType(type: string): boolean {
    return typesList.indexOf(type) > -1;
  },

  number(value: any): boolean {
    return typeof value === 'number';
  },

  int(value: any): boolean {
    return (typeof value === 'number' && ("" + value).indexOf('.') === -1);
  },

  float(value: any): boolean {
    return (typeof value === 'number' && ("" + value).indexOf('.') > -1);
  },

  string(value: any): boolean {
    return typeof value === 'string';
  },

  boolean(value: any): boolean {
    return typeof value === 'boolean';
  },

  primitive(value: any): boolean {
    return (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean');
  },

  date(value: any): boolean {
    return value instanceof Date;
  },

  regExp(value: any): boolean {
    return value instanceof RegExp;
  },

  function(value: any): boolean {
    return typeof value === 'function';
  },

  object(value: any): boolean {
    return value && typeof value === "object" && value.toString() === "[object Object]";
  },

  array(value: any): boolean {
    return Array.isArray(value);
  },

  arrayOf(type: string, value: any[]): boolean {
    let lng = type.length;

    if (type.charAt(lng - 1) === 's')
      type = type.slice(0, lng - 1);

    if (this.isValidType(type) && Array.isArray(value))
      return value.every((entry: any) => (<any>this)[capitalizeFirst(type)](entry));

    return false;
  },

  getTypesOf(value: any): string[] {
    let types = ['any'];
    if (!Array.isArray(value)) {
      for (let i = 0; i < typesList.length; i++)
        if ((<any>this)[capitalizeFirst(typesList[i])](value))
          types.push(typesList[i]);
    } else {
      types.push('array', 'any[]');
      for (let i = 0; i < typesList.length; i++)
        if (this.isArrayOf(typesList[i], value))
          types.push(typesList[i] + '[]');

      if (Types.object(value[0])) {
        types.push(value[0].constructor.name + '[]');
        types.push('object[]');
      }
    }

    types.push(...searchReverseMap(types));

    if (types.indexOf("object") > -1) {
      types.push(value.constructor);
      types.push(value.constructor.name);
    }

    return types;
  }
}