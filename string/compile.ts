export function compile(template: string, ...data: { [key: string]: any }[]): string {
  let reg = /\{\{\s*([\w\.]+)\s*\}\}/g;
  let skip = data.length > 1;

  for (let i = 0; i < data.length; i++) {
    let source = data[i];
    skip = i < data.length - 1;

    template = template.replace(reg, (match: string, $1: string): string => {
      let parts = $1.split("."), temp: any;
      match = match;
  
      if (parts.length == 1) {
        let value = source[parts[0]];
        return value === undefined ? (skip ? `{{${$1}}}` : "") : value;
      }
  
      temp = source[parts[0]];
  
      for (let i = 1; i < parts.length; i++) {
        temp = temp[parts[i]];
      }
  
      return temp === undefined ? (skip ? `{{${$1}}}` : "") : temp;
    });
  }

  return template;
}