import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { GuestGuard } from "../../../guards/guest-guard";
import { IssuerGuard } from "../../../guards/issuer-guard";
import { useAuth } from "../../../hooks/use-auth";
import { useMounted } from "../../../hooks/use-mounted";
import { usePageView } from "../../../hooks/use-page-view";
import { Layout as AuthLayout } from "../../../layouts/auth/classic-layout";
import { Issuer } from "../../../utils/auth";

const useParams = () => {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || undefined;

  return {
    returnTo,
  };
};

const initialValues = {
  email: "",
  password: "",
  tenant: "trabalhista",
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Insira um email válido")
    .max(255)
    .required("Email é obrigatório"),
  password: Yup.string().max(255).required("Senha é obrigatória"),
  tenant: Yup.string().required("Defina qual área de acesso"),
});

const LoginFirebase = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { returnTo } = useParams();
  const { signInWithEmailAndPassword, setTenant } = useAuth();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await signInWithEmailAndPassword(
          values.email,
          values.password,
          values.tenant
        );

        await setTenant(values.tenant);

        const provisional = `/${values.tenant}/clientes`;

        if (isMounted()) {
          router.push(returnTo || provisional);
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  usePageView();

  return (
    <>
      <Head>
        <title>Login | FA</title>
      </Head>
      <div>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src="/assets/logos/logo-fa-full.png" />
        </Box>
        <Card elevation={16} sx={{ mt: 5 }}>
          <CardHeader sx={{ pb: 0 }} title="Entrar" />
          <CardContent>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Box
                sx={{
                  flexGrow: 1,
                }}
              >
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                />
              </Box>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Usuário"
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
                <FormControl fullWidth>
                  <InputLabel id="tenant">Área</InputLabel>
                  <Select
                    labelId="tenant"
                    id="tenant"
                    name="tenant"
                    value={formik.values.tenant}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={!!(formik.touched.tenant && formik.errors.tenant)}
                    helperText={formik.touched.tenant && formik.errors.tenant}
                  >
                    <MenuItem value="civil">Civil</MenuItem>
                    <MenuItem value="familia">Familia</MenuItem>
                    <MenuItem value="trabalhista">Trabalhista</MenuItem>
                  </Select>
                </FormControl>
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
                  Entrar
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
        <Stack spacing={3} display="flex" alignItems="center" sx={{ mt: 3 }}>
          <Alert severity="error">
            <div>
              Problemas? entre em contato com: <b>contato@apptos.com.br</b>
            </div>
          </Alert>
        </Stack>
      </div>
    </>
  );
};

LoginFirebase.getLayout = (page) => (
  <IssuerGuard issuer={Issuer.Firebase}>
    <GuestGuard>
      <AuthLayout>{page}</AuthLayout>
    </GuestGuard>
  </IssuerGuard>
);

export default LoginFirebase;
