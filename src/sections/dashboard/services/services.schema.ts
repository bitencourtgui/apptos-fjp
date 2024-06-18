import * as Yup from "yup";

export const openingServiceSchema = Yup.object().shape({
  cashPayment: Yup.boolean(),
  openingContract: Yup.number()
    .typeError("Digite um valor válido")
    .required("Digite o valor da taxa de abertura"),
  paymentDate: Yup.string().required("Selecione a data de pagamento"),
});
