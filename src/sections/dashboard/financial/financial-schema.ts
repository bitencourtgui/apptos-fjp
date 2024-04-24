import * as Yup from "yup";

export const paymentSchema = Yup.object().shape({
  amount: Yup.number(),
  downPayment: Yup.string(),
  frequency: Yup.string().required("Selecione Indeterminado ou Mensal"),
  monthlyPayment: Yup.string(),
  installments: Yup.number()
    .required("Digite a quantidade de parcelas")
    .test("is-in-range", "No mínimo 1 parcela", (value) => {
      return value >= 1;
    }),
  // firstPayment: Yup.date().required("Digite uma data válida"),
  recurrence: Yup.number()
    .required("Digite um valor entre 1 e 30")
    .test("is-in-range", "O valor deve estar entre 1 e 30", (value) => {
      return value >= 1 && value <= 30;
    }),
  fees: Yup.number()
    .min(0, "O valor não pode ser negativo")
    .max(30, "O valor não pode ser maior que 30")
});
