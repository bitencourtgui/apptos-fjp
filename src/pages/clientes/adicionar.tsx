import NextLink from "next/link";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import {
  Box,
  Container,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";

import { Layout as DashboardLayout } from "@/layouts/dashboard";
import { CustomerAddForm } from "@/sections/dashboard/customer/customer-add-form";
import { Head } from "@/components/Head";

const Adicionar = () => {
  return (
    <>
      <Head page="Novo Cliente" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 6,
        }}
      >
        <Container maxWidth={false}>
          <Stack spacing={4}>
            <Stack spacing={4}>
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
            </Stack>
            <CustomerAddForm customer={undefined} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Adicionar.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Adicionar;
