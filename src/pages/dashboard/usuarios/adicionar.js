import NextLink from "next/link";
import Head from "next/head";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import {
  Box,
  Container,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { usePageView } from "../../../hooks/use-page-view";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import { CustomerAddForm } from "../../../sections/dashboard/customer/customer-add-form";
import { useAuth } from "../../../hooks/use-auth";

const AdicionarClienteDash = () => {
  const { getTenant } = useAuth();
  const gt = getTenant();
  usePageView();

  return (
    <>
      <Head>
        <title>Novo Cliente | FA</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Stack spacing={4}>
              <div>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href="/clientes"
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <SvgIcon sx={{ mr: 1 }}>
                    <ArrowLeftIcon />
                  </SvgIcon>
                  <Typography variant="subtitle2">Clientes</Typography>
                </Link>
              </div>
            </Stack>
            <CustomerAddForm />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

AdicionarClienteDash.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default AdicionarClienteDash;
