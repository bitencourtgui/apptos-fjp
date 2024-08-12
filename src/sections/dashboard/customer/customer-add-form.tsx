import { useState } from "react";
import { useFormik } from "formik";
import { v4 as uuidv4 } from "uuid";
import NextLink from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
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

import { useAuth } from "@/hooks/use-auth";
import CustomersApi from "@/api/customers";
import { businessSchema, customersSchema } from "./customer-schema";
import { customersInitial } from "./customer-initial";

import { LegalPerson } from "@/sections/dashboard/customer/LegalPerson";
import { PrivatePerson } from "@/sections/dashboard/customer/PrivatePerson";

export const CustomerAddForm = ({ customer, ...other }) => {
  const customerID = uuidv4();
  const router = useRouter();
  const { getTenant } = useAuth();
  const gt = getTenant();

  const [IsLegalPerson, setLegalPerson] = useState(true);

  const onSubmit = async (values, helpers) => {
    try {

      const response = await CustomersApi.setCustomer(customerID, values);

      if (response.status === 200) {
        toast.success("Cliente cadastrado");
        helpers.setStatus({ success: true });
        router.push(`/${gt}/clientes/${customerID}`);
      } else {
        console.error("[ERROR] CAD-CLIENTE", response)
      }
    } catch (err) {
      console.error("[ERROR] CAD-CLIENTE", err)
      toast.error("Falha ao cadastrar cliente");
      helpers.setStatus({ success: false });
      helpers.setErrors({ submit: err.message });
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: customersInitial,
    validationSchema: IsLegalPerson ? businessSchema : customersSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} {...other}>
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
            Cadastrar
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
