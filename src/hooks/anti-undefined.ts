export const antiUndefined = (obj: any): any => {
  return Array.isArray(obj)
    ? obj.map((item) => antiUndefined(item))
    : Object.fromEntries(
        Object.entries(obj)
          .filter(([_, v]) => v !== undefined)
          .map(([k, v]) => [k, v === Object(v) ? antiUndefined(v) : v]),
      );
};
