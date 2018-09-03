export function getFileExtension(fileName: string): string {
  if (!fileName || fileName.indexOf(".") < 0) return "";
  return fileName.slice(fileName.lastIndexOf(".") + 1);
}