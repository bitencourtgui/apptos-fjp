import * as Yup from "yup";

export const openingServiceSchema = Yup.object().shape({
  cashPayment: Yup.boolean(),
  openingContract: Yup.number()
    .typeError("Digite um valor válido")
    .required("Digite o valor da taxa"),
  paymentDate: Yup.string().required("Selecione a data de pagamento"),
});

export const AccountingServiceSchema = Yup.object().shape({
  paymentEntry: Yup.boolean(),
  accountingPayment: Yup.number().typeError("Digite um valor válido"),
  accountingFee: Yup.number().typeError("Digite um valor válido"),
  accountingDate: Yup.string().required("Selecione a data de pagamento"),
  billingRange: Yup.number().typeError("Digite um valor válido"),
});
