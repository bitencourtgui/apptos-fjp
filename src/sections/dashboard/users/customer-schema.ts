import * as Yup from "yup";

export const customersSchema = Yup.object().shape({
  name: Yup.string().required("Digite o nome completo"),
  email: Yup.string().email("Digite um email válido"),
  cpf: Yup.string(),
  cnpj: Yup.string(),
  rg: Yup.string().required("Digite um RG válido"),
  phone1: Yup.string(),
  phone2: Yup.string(),
  nationality:  Yup.string().required("Digite a nacionalidade"),
});
