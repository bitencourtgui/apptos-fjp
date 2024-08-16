import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

import { Issuer } from "@/utils/auth";
import { Head } from "@/components/Head";
import { usePageView } from "@/hooks/use-page-view";

import { LoginForm } from "@/sections/auth/loginForm";

import { GuestGuard } from "@/guards/guest-guard";
import { IssuerGuard } from "@/guards/issuer-guard";

import { Layout } from "@/layouts/auth/classic-layout";

const LoginFirebase = () => {
  usePageView();

  return (
    <>
      <Head page="Entrar" />
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src="/assets/logos/logo-fjp.png" />
      </Box>
      <Card elevation={16} sx={{ mt: 5 }}>
        <CardHeader sx={{ pb: 0 }} title="Entrar" />
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <Stack spacing={3} display="flex" alignItems="center" sx={{ mt: 3 }}>
        <Alert severity="error">
          Problemas? entre em contato com: <b>suporte@goduck.com.br</b>
        </Alert>
      </Stack>
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <img src="/goduck-claro.png" width={130} />
      </Box>
    </>
  );
};

LoginFirebase.getLayout = (page) => (
  <IssuerGuard issuer={Issuer.Firebase}>
    <GuestGuard>
      <Layout>{page}</Layout>
    </GuestGuard>
  </IssuerGuard>
);

export default LoginFirebase;
