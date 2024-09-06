import * as Yup from "yup";

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
