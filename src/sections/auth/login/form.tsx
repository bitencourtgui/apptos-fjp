"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
// import { useAuth } from "@/hooks/use-auth";
// import { useMounted } from "@/hooks/use-mounted";

import { initialValues } from "@/sections/auth/login/initial";
import { validationSchema } from "@/sections/auth/login/schema";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

import type { Auth } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/auth/firebase/client";
import { useMounted } from "@/hooks/use-mounted";

const useParams = () => {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || undefined;

  return { returnTo };
};

export const LoginForm = () => {
  const router = useRouter();
  const { returnTo } = useParams();
  const isMounted = useMounted();

  const [firebaseAuth] = useState<Auth>(getFirebaseAuth());

  // const isMounted = useMounted();
  // const { signInWithEmailAndPassword } = useAuth();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      console.info("values", values);

      try {
        await signInWithEmailAndPassword(
          firebaseAuth,
          values.email,
          values.password,
        );

        const provisional = `/clientes`;

        if (isMounted()) {
          router.push(returnTo || provisional);
        }
      } catch (err) {
        // setError('root', { type: 'server', message: (err as { message: string }).message });
        console.info("err", err);
        // setIsPending(false);
      }
      // try {
      //   await signInWithEmailAndPassword(
      //     values.email,
      //     values.password,
      //     values.tenant
      //   );

      //

      // } catch (error) {
      //   let errorMessage = "Ocorreu um erro desconhecido";

      //   if (error instanceof Error) {
      //     errorMessage = error.message;
      //   }

      //   console.error(errorMessage);

      //   if (isMounted()) {
      //     helpers.setStatus({ success: false });
      //     helpers.setErrors({ submit: errorMessage });
      //     helpers.setSubmitting(false);
      //   }
      // }
    },
  });

  const errorMessage =
    typeof formik.errors.submit === "string"
      ? formik.errors.submit
      : Array.isArray(formik.errors.submit)
        ? (formik.errors.submit as string[]).join(", ")
        : "";

  return (
    <form onSubmit={formik.handleSubmit}>
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
        <Button size="large" type="submit" variant="contained" fullWidth>
          Entrar
        </Button>
        {/* <Button
          disabled={formik.isSubmitting}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          Entrar
        </Button> */}
      </Box>
    </form>
  );
};