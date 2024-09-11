"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Unstable_Grid2 as Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { FormPerson } from "../personal/personal";
import { initialValues } from "./initial";
import { useFormik } from "formik";
import { businessSchema } from "../business/schema";
import { customersSchema } from "../personal/schema";
import { useState } from "react";
import NextLink from "next/link";
import { FormBusiness } from "../business/business";
import { useAddCustomer } from "@/hooks/use-customers";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/core/toaster";
import { useRouter } from "next/navigation";

export const NovoCliente = ({ customer }: any) => {
  const [IsLegalPerson, setLegalPerson] = useState(
    customer?.business?.corporateName !== "",
  );

  const customerID = uuidv4();
  const router = useRouter();
  const [addCustomerState, addCustomer] = useAddCustomer(); // Usa o hook

  const onSubmit = async (values: any, helpers: any) => {
    try {
      // Chama a função `addCustomer` para adicionar o cliente
     await addCustomer(customerID, values);

        toast.success("Cliente cadastrado");
        helpers.setStatus({ success: true });
        router.push(`/clientes/${customerID}`);
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
      // Libera o estado de submissão do formulário
      helpers.setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: customer ?? initialValues,
    validationSchema: IsLegalPerson ? businessSchema : customersSchema,
    enableReinitialize: true,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader title="Cadastrar cliente" />
        <CardContent sx={{ pt: 0 }}>
          <Grid pb={3}>
            <FormControlLabel
              control={
                <Switch
                  color="primary"
                  edge="start"
                  checked={IsLegalPerson}
                  onChange={() =>
                    setLegalPerson((currentState) => !currentState)
                  }
                />
              }
              label={IsLegalPerson ? "Pessoa jurídica" : "Pessoa física"}
              sx={{ pl: 2 }}
            />
          </Grid>
          {/* Pessoa Juridica */}
          {IsLegalPerson && (
            <Grid container spacing={3}>
              <FormBusiness {...formik} />
            </Grid>
          )}

          {/* Pessoa Física */}
          {!IsLegalPerson && (
            <Grid container spacing={3}>
              <FormPerson {...formik} />
            </Grid>
          )}
        </CardContent>
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
            Cadastrar
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
      </Card>
    </form>
  );
};
