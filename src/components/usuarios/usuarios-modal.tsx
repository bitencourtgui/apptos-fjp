import * as Yup from "yup";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
import { useFormik } from "formik";

import {
  Drawer,
  IconButton,
  SvgIcon,
  Box,
  Button,
  FormHelperText,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
// import { useMounted } from "../../../hooks/use-mounted";
// import { useAuth } from "../../../hooks/use-auth";
// import UserApi from "../../../api/users";
import { v4 as uuidv4 } from "uuid";
import { useMounted } from "@/hooks/use-mounted";
import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { getFirebaseAuth } from "@/lib/auth/firebase/client";
import { useUser } from "@/hooks/use-users";

const initialValues = {
  email: "",
  password: "",
  role: "",
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Deve ser um email válido")
    .max(255)
    .required("Email é obrigatório"),
  password: Yup.string().min(7).max(255).required("Senha é obrigatória"),
});

const roles = [
  { name: "Advogado", value: "lawyer" },
  { name: "Contador", value: "accountant" },
  { name: "Estágiario", value: "intern" },
];

export const UserDrawer = ({
  onClose,
  onReset,
  open,
  number,
  tribunal,
  reload,
  ...other
}: any) => {
  const userID = uuidv4();

  const isMounted = useMounted();

  const [firebaseAuth] = useState<Auth>(getFirebaseAuth());
  const { createUser } = useUser(userID);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // Criação do usuário no Firebase Auth
        const { user } = await createUserWithEmailAndPassword(
          firebaseAuth,
          values.email,
          values.password,
        );

        const userID = user.uid; // Pegando o UID gerado pelo Firebase

        // Criação do usuário na sua API
        const result = await createUser({
          user: values.email,
          role: values.role,
          uuid: userID, // Passando o UID como uuid
        });

        // Verifica a resposta da API
        if (result.status === 200) {
          // toast.success("Usuário criado com sucesso!"); // Descomente se for usar notificações
          onClose({ isOpen: false }); // Fecha o modal ou janela após sucesso
          reload(); // Recarrega a página ou atualiza a lista de usuários
        }
      } catch (err) {
        console.error(err);

        // Verifica se o componente ainda está montado antes de setar erros
        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message }); // Define os erros no Formik
          helpers.setSubmitting(false); // Define que o formulário parou de enviar
          // toast.error("Erro ao criar usuário: " + err.message); // Descomente se for usar notificações
        }
      }
    },
  });

  return (
    <Drawer
      disableScrollLock
      anchor="right"
      onClose={onClose}
      open={open}
      ModalProps={{
        BackdropProps: {
          invisible: true,
        },
        sx: { zIndex: 1400 },
      }}
      PaperProps={{
        elevation: 24,
        sx: {
          maxWidth: "100%",
          width: 440,
        },
      }}
      {...other}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={3}
        sx={{
          px: 3,
          pt: 2,
        }}
      >
        <Typography variant="h6">Novo usuário</Typography>
        <Stack alignItems="center" direction="row" spacing={0.5}>
          <IconButton color="inherit" onClick={onClose}>
            <SvgIcon>
              <XIcon />
            </SvgIcon>
          </IconButton>
        </Stack>
      </Stack>
      <Stack sx={{ p: 3 }}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Função
              </Typography>
              <Stack
                alignItems="center"
                direction="row"
                flexWrap="wrap"
                gap={2}
              >
                {roles.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.name}
                    onClick={() => formik.setFieldValue("role", option.value)}
                    sx={{
                      borderColor: "transparent",
                      borderRadius: 1.5,
                      borderStyle: "solid",
                      borderWidth: 2,
                      ...(option.value === formik.values.role && {
                        borderColor: "primary.main",
                      }),
                    }}
                  />
                ))}
              </Stack>
            </Stack>
            <TextField
              error={!!(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Endereço de email"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
            />
            <TextField
              error={!!(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Senha"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
            />
          </Stack>
          {formik.errors.submit && (
            <FormHelperText error sx={{ mt: 3 }}>
              {formik.errors.submit}
            </FormHelperText>
          )}
          <Box sx={{ mt: 2 }}>
            <Button
              disabled={formik.isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Cadastrar
            </Button>
          </Box>
        </form>
      </Stack>
    </Drawer>
  );
};
