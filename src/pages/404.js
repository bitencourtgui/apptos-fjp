import NextLink from "next/link";
import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { usePageView } from "../hooks/use-page-view";
import { paths } from "../paths";

const Page = () => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  usePageView();

  return (
    <>
      <Head>
        <title>Error: Not Found | Devias Kit PRO</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          py: "80px",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 6,
            }}
          >
            <Box
              alt="Not found"
              component="img"
              src="/assets/errors/error-404.png"
              sx={{
                height: "auto",
                maxWidth: "100%",
                width: 400,
              }}
            />
          </Box>
          <Typography align="center" variant={mdUp ? "h1" : "h4"}>
            404: A página que você está procurando não está aqui.
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mt: 0.5 }}>
          Você deve ter tentado algum caminho estranho ou veio aqui por engano. Seja qual for o caso, tente usar a navegação.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 6,
            }}
          >
            <Button component={NextLink} href={"/"}>
              Voltar para o inicio
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Page;
