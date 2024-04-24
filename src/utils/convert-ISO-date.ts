export const convertToISODate = (inputDate: string): string => {
  const [day, month, year] = inputDate.split("/");
  const isoDate: string = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return isoDate;
};
