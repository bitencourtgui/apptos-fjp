export const maskProcess = (process: string): string => {
    if (process && process.length !== 20) {
      return process;
    }
  
    const formattedNumber =
      process?.slice(0, 7) +
      "-" +
      process?.slice(7, 9) +
      "." +
      process?.slice(9, 13) +
      "." +
      process?.slice(13, 14) +
      "." +
      process?.slice(14, 16) +
      "." +
      process?.slice(16, 20);
  
    return formattedNumber;
  };
  