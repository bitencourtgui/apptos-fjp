/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import NextLink from "next/link";
import toast from "react-hot-toast";
import { useFormik } from "formik";
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
import CustomersApi from "../../../api/customers";
import { customersInitial } from "./customer-initial";
import { businessSchema, customersSchema } from "./customer-schema";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/use-auth";

import { LegalPerson } from "@/sections/dashboard/customer/LegalPerson";
import { PrivatePerson } from "@/sections/dashboard/customer/PrivatePerson";

export const CustomerEditForm = ({ customer, ...other }) => {

  const router = useRouter();
  const { getTenant } = useAuth();
  const gt = getTenant();

  const isBusiness = customer?.business?.corporateName.lenght > 1;

  const [IsLegalPerson, setLegalPerson] = useState(isBusiness);

  const onSubmit = async (values, helpers) => {
    try {

      const response = await CustomersApi.updateCustomer(customer.id, values);

      if (response.status === 200) {
        toast.success("Cliente editado com sucesso");
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        router.push(`/${gt}/clientes/${customer.id}`);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (err) {
      toast.error("Falha ao editar cliente");
      helpers.setStatus({ success: false });
      helpers.setErrors({ submit: err.message });
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: customer || customersInitial,
    validationSchema: IsLegalPerson ? businessSchema : customersSchema,
    onSubmit
  });

  return (
    <form onSubmit={formik.handleSubmit} {...other}>
      <Card>
        <CardHeader title="Editar cliente" />
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
              <LegalPerson {...formik} />
            </Grid>
          )}

          {/* Pessoa Física */}
          {!IsLegalPerson && (
            <Grid container spacing={3}>
              <PrivatePerson {...formik} />
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
            Editar
          </Button>
          <Button
            color="inherit"
            component={NextLink}
            disabled={formik.isSubmitting}
            href={`/${gt}/clientes`}
          >
            Cancelar
          </Button>
        </Stack>
      </Card>
    </form>
  );
};
