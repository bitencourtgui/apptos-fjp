export const convertFileSize = (bytes: number): string => {
  const units: string[] = ["bytes", "KB", "MB", "GB", "TB"];

  let unitIndex: number = 0;
  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024;
    unitIndex++;
  }

  const formattedSize: string = bytes.toFixed(2);
  return `${formattedSize} ${units[unitIndex]}`;
};
