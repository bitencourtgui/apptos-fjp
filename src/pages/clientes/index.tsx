import { useCallback } from "react";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "@/layouts/dashboard";
import { CustomerListSearch } from "@/sections/dashboard/customer/customer-list-search";
import { CustomerListTable } from "@/sections/dashboard/customer/customer-list-table";
import { Head } from "@/components/Head";
import { useCustomers } from "@/hooks/useCustomer";
import { useSearch } from "@/hooks/useSearch";

const Clientes = () => {
  const { search, updateSearch } = useSearch();
  const { customers, customersCount } = useCustomers(search);

  const handleFiltersChange = useCallback(
    (filters) => {
      updateSearch((prevState) => ({
        ...prevState,
        filters,
      }));
    },
    [updateSearch]
  );

  const handlePageChange = useCallback(
    (event, page) => {
      updateSearch((prevState) => ({
        ...prevState,
        page,
      }));
    },
    [updateSearch]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      updateSearch((prevState) => ({
        ...prevState,
        rowsPerPage: parseInt(event.target.value, 10),
      }));
    },
    [updateSearch]
  );

  return (
    <>
      <Head page="Clientes" />
      <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
        <Container maxWidth={false}>
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Typography variant="h4">Clientes</Typography>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  href="/clientes/adicionar"
                  size="small"
                  variant="contained"
                  startIcon={
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  }
                >
                  Adicionar
                </Button>
              </Stack>
            </Stack>
            <Card>
              <CustomerListSearch onFiltersChange={handleFiltersChange} />
              <CustomerListTable
                customers={customers}
                customersCount={customersCount}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={search.rowsPerPage}
                page={search.page}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Clientes.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Clientes;
