import * as Yup from "yup";

export const validationSchema = Yup.object({
  email: Yup.string()
    .email("Insira um email válido")
    .max(255)
    .required("Email é obrigatório"),
  password: Yup.string().max(255).required("Senha é obrigatória"),
  tenant: Yup.string().required("Defina qual área de acesso"),
});
