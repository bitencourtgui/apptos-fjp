import { useCallback, useEffect, useState } from "react";
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
import { useMounted } from "../../../hooks/use-mounted";
import { usePageView } from "../../../hooks/use-page-view";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import { CustomerListSearch } from "@/sections/dashboard/customer/customer-list-search";
import { CustomerListTable } from "../../../sections/dashboard/customer/customer-list-table";
import customersApi from "../../../api/customers";
import { Head } from "@/components/Head";

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      query: undefined,
      hasAcceptedMarketing: undefined,
      isProspect: undefined,
      isReturning: undefined,
    },
    page: 0,
    rowsPerPage: 10,
    sortBy: "updatedAt",
    sortDir: "desc",
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useCustomers = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    customers: [],
    customersCount: 0,
  });

  const getCustomers = useCallback(async () => {
    try {
      const response = await customersApi.getCustomers(search);

      if (isMounted()) {
        setState({
          customers: response.data,
          customersCount: response.count,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [search, isMounted]);

  useEffect(
    () => {
      getCustomers();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]
  );

  return state;
};

const ClientesDash = () => {
  const { search, updateSearch } = useSearch();
  const { customers, customersCount } = useCustomers(search);

  usePageView();

  const handleFiltersChange = useCallback((filters) => {
      updateSearch((prevState) => ({
        ...prevState,
        filters,
      }));
    },[updateSearch]);

  const handlePageChange = useCallback((event, page) => {
      updateSearch((prevState) => ({
        ...prevState,
        page,
      }));
    },[updateSearch]);

  const handleRowsPerPageChange = useCallback((event) => {
      updateSearch((prevState) => ({
        ...prevState,
        rowsPerPage: parseInt(event.target.value, 10),
      }));
    },[updateSearch]);

  return (
    <>
      <Head page="Clientes" />
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth={false}>
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack>
                <Typography variant="h4">Clientes</Typography>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  href="/tributario/clientes/adicionar"
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

ClientesDash.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default ClientesDash;
