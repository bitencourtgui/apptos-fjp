import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

import Image from "next/image";
import { LoginForm } from "@/sections/auth/login/form";

const Login = () => {
  return (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src="/assets/logos/logo-fjp.png"
          alt="logo fjp"
          width={382}
          height={72}
        />
      </Box>
      <Card elevation={16} sx={{ mt: 5 }}>
        <CardHeader sx={{ pb: 0 }} title="Entrar" />
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <Stack spacing={3} display="flex" alignItems="center" sx={{ mt: 3 }}>
        <Alert severity="error">
          Problemas? entre em contato com:{" "}
          <strong>suporte@goduck.com.br</strong>
        </Alert>
      </Stack>
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Image
          src="/assets/logos/goduck-claro.png"
          alt="logo goduck"
          width={130}
          height={22}
        />
      </Box>
    </>
  );
};
export default Login;
