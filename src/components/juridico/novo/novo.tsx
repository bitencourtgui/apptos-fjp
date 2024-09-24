"use client";

import { Button, Stack, Unstable_Grid2 as Grid } from "@mui/material";
import { initialValues } from "./initial";
import { useFormik } from "formik";
import NextLink from "next/link";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/core/toaster";
import { useRouter } from "next/navigation";
import { FormProcesses } from "../form/processos";
import { useAddProcess } from "@/hooks/use-processes";
import { useProcessById } from "@/hooks/use-processes";

export const NovoProcesso = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const customerId = searchParams.get("customerId");
  const processesId = searchParams.get("id");

  const router = useRouter();
  const processesID = uuidv4();
  const [addProcess ] = useAddProcess();

  const { process } = useProcessById(String(processesId));

  const onSubmit = async (values: any, helpers: any) => {
    try {
      values.customerId = customerId;

      await addProcess(processesID, values); // Call the function

      toast.success("Cliente cadastrado");
      helpers.setStatus({ success: true });
      router.push(`/clientes/${customerId}`);
    } catch (err) {
      console.error(err);
      helpers.setStatus({ success: false });

      if (err instanceof Error) {
        helpers.setErrors({ submit: err.message });
      } else {
        helpers.setErrors({ submit: "Ocorreu um erro desconhecido." });
      }

      helpers.setSubmitting(false);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: process ?? initialValues,
    enableReinitialize: true,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3} p={3} sx={{ display: "flex" }}>
        <FormProcesses {...formik} />
      </Grid>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        flexWrap="wrap"
        spacing={3}
        sx={{ p: 3 }}
      >
        <Button
          disabled={formik.isSubmitting}
          type="submit"
          variant="contained"
        >
          Atualizar
        </Button>
        <Button
          color="inherit"
          component={NextLink}
          disabled={formik.isSubmitting}
          href="/clientes"
        >
          Cancelar
        </Button>
      </Stack>
    </form>
  );
};
