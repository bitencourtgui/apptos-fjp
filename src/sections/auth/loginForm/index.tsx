import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { useAuth } from "@/hooks/use-auth";
import { useMounted } from "@/hooks/use-mounted";
import { initialValues } from "./login.initial";
import { validationSchema } from "./login.schema";

const useParams = () => {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || undefined;

  return { returnTo };
};

export const LoginForm = () => {
  const router = useRouter();
  const { returnTo } = useParams();

  const isMounted = useMounted();
  const { signInWithEmailAndPassword } = useAuth();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // @ts-ignore
        await signInWithEmailAndPassword(values.email, values.password, values.tenant);

        const provisional = `/clientes`;

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

  const errorMessage = typeof formik.errors.submit === 'string'
    ? formik.errors.submit
    : Array.isArray(formik.errors.submit)
    ? formik.errors.submit.join(', ')
    : '';

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ alignItems: "center", display: "flex" }} />
      </Box>
      <Stack spacing={2}>
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
      </Stack>
      {errorMessage && (
        <FormHelperText error sx={{ mt: 3 }}>
          {errorMessage}
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
  );
};
