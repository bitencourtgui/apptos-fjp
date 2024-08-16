/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState, useRef } from "react";
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
import { UserListTable } from "../../../sections/dashboard/users/users-list-table";
import { t } from "i18next";
import { tokens } from "../../../locales/tokens";
import UserApi from "../../../api/users";
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

const useCustomers = () => {
  const isMounted = useMounted();
  const [state, setState] = useState<any>({ customers: [], reload: undefined });

  const getCustomers = useCallback(async () => {
    try {
      const response = await UserApi.getUsers();

      if (isMounted()) {
        setState({
          customers: response.data,
          reload: getCustomers,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getCustomers();
  }, []);

  return state;
};

const UsuariosDash = () => {
  const rootRef = useRef(null);

  const [drawer, setDrawer] = useState({
    isOpen: false,
    data: undefined,
  });

  const { search, updateSearch } = useSearch();
  const { customers } = useCustomers();

  usePageView();

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
      <Head page="Usuários" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Usuários</Typography>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  onClick={() => {
                    setDrawer({ isOpen: true, data: undefined });
                  }}
                  startIcon={
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  {t(tokens.nav.add).toString()}
                </Button>
              </Stack>
            </Stack>
            <Card>
              <UserListTable
                customers={customers}
                customersCount={0}
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

UsuariosDash.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default UsuariosDash;
