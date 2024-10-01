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
import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/auth/firebase/client";
import { useUser } from "@/hooks/use-users";

interface FormValues {
  name: string;
  document: string;
  email: string;
  business: {
    document: string;
    email: string;
    corporateName: string;
  };
}

interface SendEmailPayload {
  to: string;
  firstName: string;
  username: string;
  password: string;
  subject: string;
}

export const NovoCliente = ({ customer }: any) => {
  const [IsLegalPerson, setLegalPerson] = useState(
    customer?.business?.corporateName !== "",
  );

  const customerID = uuidv4();
  const router = useRouter();
  const [addCustomerState, addCustomer] = useAddCustomer(); // Usa o hook
  const { createUser } = useUser(customerID);

  const onSubmit = async (values: FormValues, helpers: any) => {
    try {
      // Chama a função `addCustomer` para adicionar o cliente
      await addCustomer(customerID, values);

      const document = IsLegalPerson
        ? values.business?.document
        : values.document;

      const userEmail = IsLegalPerson ? values.business?.email : values.email;
      const userName = IsLegalPerson
        ? values.business?.corporateName
        : values.name;

      // Criação do email (sem autenticação)
      const email = `${document}@cliente.fjp.br`;
      const senha = `${document?.slice(0, 8)}${new Date().getFullYear()}`;

      // Criação do usuário na sua API
      const result = await createUser({
        user: email,
        role: "cliente",
        uuid: customerID, // Use o customerID aqui
      });

      // Envio do e-mail de boas-vindas
      await sendWelcomeEmail({
        to: userEmail,
        firstName: userName,
        username: email,
        password: senha,
        subject: "Bem-vindo à FJP Consultoria!",
      });

      toast.success("Cliente cadastrado com sucesso");
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

  // Função para enviar o e-mail
  const sendWelcomeEmail = async ({
    to,
    firstName,
    username,
    password,
    subject,
  }: SendEmailPayload): Promise<void> => {
    const payload: SendEmailPayload = {
      to,
      firstName,
      username,
      password,
      subject,
    };

    try {
      const response = await fetch("https://fjp.goduck.com.br/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Email sent successfully:", data);
    } catch (error) {
      console.error("Failed to send email:", error);
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
