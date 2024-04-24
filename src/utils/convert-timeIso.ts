export const convertDateTime = (dateTimeISO: string): string => {
  const dateTime = new Date(dateTimeISO);

  if (isNaN(dateTime.getTime())) {
    return "Invalid date and time format";
  }

  const formattedDate = dateTime.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = dateTime.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} às ${formattedTime}`;
};
