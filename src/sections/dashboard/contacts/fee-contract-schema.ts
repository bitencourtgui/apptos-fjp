import * as Yup from "yup";

export const feeSchema = Yup.object().shape({
  object: Yup.string().required("Digite um objeto válido"),
});
