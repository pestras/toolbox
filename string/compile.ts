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