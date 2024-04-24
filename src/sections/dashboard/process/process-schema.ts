import * as Yup from "yup";

export const processSchema = Yup.object().shape({
  number: Yup.string().min(20, "Número do processo inválido"),
  class: Yup.string(),
  subject: Yup.string(),
  court: Yup.string(),
  division: Yup.string(),
  distribution: Yup.string(),
  control: Yup.string(),
  area: Yup.string(),
  price: Yup.string(),
  others: Yup.string(),
  judge: Yup.string(),
});
