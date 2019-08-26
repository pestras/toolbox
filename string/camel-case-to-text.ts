export function camelCaseToText(str: string) {
  return str.replace(/(^[a-z])|([A-Z])/g, (match, $1, $2) => {
    return $1 ? $1.toUpperCase() : ' ' + $2
  });
}