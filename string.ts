export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function strSplice(src: string, start: number, deleteCount: number = src.length, insertion: string = ""): string {
  let end = (start + deleteCount) > src.length ? src.length : start + deleteCount;
  return src.slice(0, start) + insertion + src.slice(end, src.length);
}

export function getFileExtension(fileName: string): string {
  if (!fileName || fileName.indexOf(".") < 0) return "";
  return fileName.slice(fileName.lastIndexOf(".") + 1);
}

export function compile(template: string, data: { [key: string]: any }): string {
  let reg = /\{\{\s*([\w\.]+)\s*\}\}/g;

  return template.replace(reg, (match: string, $1: string): string => {
    let parts = $1.split("."), temp: any;
    match = match;

    if (parts.length == 1)
      return data[parts[0]] || "";

    temp = data[parts[0]];

    for (let i = 1; i < parts.length; i++) {
      temp = temp[parts[i]];
    }

    return temp || "";
  });
}

export function parseTime(timeStr: string): number {
  let time = 0;
  let parts = timeStr.split(' ');
  let map: { [key: string]: number } = { y: 217728000, o: 18144000, w: 604800, d: 86400, h: 3600, m: 60, s: 1 };

  parts.forEach(function (part) {
    if (!part.length) return time += 0;

    let amount = part.slice(0, -1),
      unit = part.slice(-1);

    if (map.hasOwnProperty(unit))
      time += map[unit] * parseInt(amount, 10);
  });

  return time * 1000;
}

export function random(length: number = 16, type: string = 'letters capitals numbers'): string {
  let code = '';
  let characters: any = {
    letters: 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(','),
    capitals: 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(','),
    numbers: '1,2,3,4,5,6,7,8,9,0'.split(',')
  };
  let collection: any[] = type.split(' ').reduce(function (prev, curr: string) {
    return prev.concat(characters[curr]);
  }, []);

  for (let i = 0; i < length; i++) {
    let index = Math.floor(Math.random() * collection.length);
    code += collection[index];
  }

  return code;
}

export function toRegExp(pattern: string): RegExp {
  let parts;
  let flags;
  if (pattern.charAt(0) === '/') {
    parts = decodeURI(pattern).split('/');
    flags = parts.pop();
    pattern = parts.join('/').replace(/^\/|\/$/g, '');
  }

  return new RegExp(pattern, flags);
}

export function stringify(value: any): string {
  let result = "";

  if (value === undefined)
    return 'undefined';

  if (value === null)
    return 'null';

  if (typeof value === 'number' || typeof value === 'string')
    return <string>value;

  if (value instanceof RegExp || typeof value === 'boolean')
    return value.toString();

  if (Array.isArray(value)) {
    result += '[';
    for (let i = 0; i < value.length; i++) {
      result += stringify(value[i]);
      if (i < value.length - 1)
        result += ',';
    }
    result += ']';
    return result;
  }

  if (typeof value === "object") {
    result += '{';
    for (let prop in value) {
      result += prop + ':';
      result += stringify(value[prop]);
      result += ','
    }

    result = result.length > 1 ? result.slice(0, result.length - 1) : result;
    result += '}';
    return result;
  }

  return result;
}

export function objectToQueryStr(obj: { [key: string]: any }, encode?: boolean): string {
  let result = "";

  if (!obj || !Object.keys(obj).length)
    return result;

  for (let prop in obj)
    result += '&' + prop + '=' + stringify(obj[prop]);

  return encode ? encodeURI(result.slice(1)) : result.slice(1);
}