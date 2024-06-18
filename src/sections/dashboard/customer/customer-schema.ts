import * as Yup from "yup";

export const customersSchema = Yup.object().shape({
  name: Yup.string().required("Digite o nome completo"),
  email: Yup.string().email("Digite um email válido"),
  cpf: Yup.string(),
  cnpj: Yup.string(),
  rg: Yup.string().required("Digite um RG válido"),
  phone1: Yup.string(),
  phone2: Yup.string(),
  nationality: Yup.string().required("Digite a nacionalidade"),
});

export const businessSchema = Yup.object().shape({
  business: Yup.object().shape({
    document: Yup.string().required("Digite o CNPJ"),
    corporateName: Yup.string().required("Digite a Razão Social"),
    cnae: Yup.string().required("Digite o CNAE"),
    address: Yup.object().shape({
      postalCode: Yup.string().required("Digite o CEP"),
      street: Yup.string().required("Digite a Rua"),
      number: Yup.string().required("Digite o Número"),
      complement: Yup.string(),
      neighborhood: Yup.string().required("Digite o Bairro"),
      city: Yup.string().required("Digite a Cidade"),
      state: Yup.string().required("Digite o Estado"),
    }),
  }),
});
