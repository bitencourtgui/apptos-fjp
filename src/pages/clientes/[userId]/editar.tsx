import NextLink from "next/link";
import { Head } from "@/components/Head";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import {
  Avatar,
  Box,
  Chip,
  Container,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "@/layouts/dashboard";
import { CustomerEditForm } from "@/sections/dashboard/customer/customer-edit-form";
import { getInitials } from "@/utils/get-initials";
import { useRouter } from "next/router";
import { useCustomer } from "@/hooks/useCustomer";

const EditarCliente = () => {
  const router = useRouter();
  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId ?? "";

  const { customer } = useCustomer(userId);

  if (!customer) {
    return null;
  }

  return (
    <>
      <Head page="Editar Cliente" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 6,
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
              <Stack
                alignItems="flex-start"
                direction={{
                  xs: "column",
                  md: "row",
                }}
                justifyContent="space-between"
                spacing={4}
              >
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Avatar
                    src={customer.avatar}
                    sx={{
                      height: 64,
                      width: 64,
                    }}
                  >
                    {getInitials(
                      customer?.name || customer?.business?.corporateName
                    )}
                  </Avatar>
                  <Stack spacing={1}>
                    <Typography variant="h4">
                      {customer?.name || customer?.business?.corporateName}
                    </Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">id:</Typography>
                      <Chip label={customer.id} size="small" />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <CustomerEditForm customer={customer} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

EditarCliente.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default EditarCliente;
