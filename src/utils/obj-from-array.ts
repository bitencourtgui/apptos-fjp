type ObjectFromArray<T, K extends keyof T> = {
  [key: string]: T;
};

export const objFromArray = <T, K extends keyof T>(
  arr: T[],
  key: K = "id" as K
): { [key: string]: T } => {
  return arr.reduce((accumulator, current) => {
    accumulator[String(current[key])] = current;
    return accumulator;
  }, {} as { [key: string]: T });
};
