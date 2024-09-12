import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Timestamp } from "firebase/firestore"; // Importa o Timestamp do Firebase

dayjs.extend(customParseFormat);

export const formatDate = (
  date: string | number | Date | Timestamp,
): string => {
  let parsedDate: dayjs.Dayjs | null = null; // Inicializa com null

  if (date instanceof Date) {
    // Se for um objeto Date, converte para timestamp
    parsedDate = dayjs(date.getTime());
  } else if (typeof date === "number") {
    // Se for um timestamp numérico, cria um dayjs diretamente com ele
    parsedDate = dayjs(date);
  } else if (date instanceof Timestamp) {
    // Se for um Timestamp do Firebase, converte para millis e cria o dayjs
    parsedDate = dayjs(date.toMillis());
  } else if (typeof date === "string") {
    // Se for uma string, tenta analisar nos formatos esperados
    const formats: string[] = ["DD/MM/YYYY", "YYYY-MM-DDTHH:mm:ss.SSSSSSZ"];

    for (const formatString of formats) {
      parsedDate = dayjs(date, formatString, true);
      if (parsedDate.isValid()) {
        break;
      }
    }
  }

  // Se parsedDate não foi inicializado corretamente, cria um valor inválido
  if (!parsedDate || !parsedDate.isValid()) {
    return "Data inválida";
  }

  // Formatando para 'DD/MM/YYYY' se a data for válida
  return parsedDate.format("DD/MM/YYYY");
};
