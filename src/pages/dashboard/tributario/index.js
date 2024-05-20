import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import ProcessApi from "../../../api/process";
import { BreadcrumbsSeparator } from "../../../components/breadcrumbs-separator";
import { useMounted } from "../../../hooks/use-mounted";
import { usePageView } from "../../../hooks/use-page-view";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import { paths } from "../../../paths";
import { ProductListSearch } from "../../../sections/dashboard/product/product-list-search";
import { ProcessListTable } from "../../../sections/dashboard/process/process-list-table";
import { useAuth } from "../../../hooks/use-auth";
import { capitalize } from "../../../utils/capitalize";

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      name: undefined,
      category: [],
      status: [],
      inStock: undefined,
    },
    page: 0,
    rowsPerPage: 5,
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useProcess = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    products: [],
    productsCount: 0,
  });

  const getProcessByUser = useCallback(async () => {
    try {
      const response = await ProcessApi.getAllProcess();

      if (isMounted()) {
        setState({
          products: response.data,
          productsCount: response.count,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getProcessByUser();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]
  );

  return state;
};

const ListaProcessos = () => {
  const { search, updateSearch } = useSearch();
  const { products, productsCount } = useProcess(search);
  const { getTenant } = useAuth();
  const gt = getTenant();

  usePageView();

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
      <Head>
        <title>Processos | FJP</title>
      </Head>
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
                <Typography variant="h4">Processos</Typography>
                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                  <Link
                    color="text.primary"
                    component={NextLink}
                    href={`/${gt}`}
                    variant="subtitle2"
                  >
                    {capitalize(gt)}
                  </Link>
                  <Link
                    color="text.primary"
                    component={NextLink}
                    href={`/${gt}/processos`}
                    variant="subtitle2"
                  >
                    Processos
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Lista
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                {/*@TODO: criar pagina de criar processos*/}
                {/* <Button
                  component={NextLink}
                  href={paths.dashboard.products.create}
                  startIcon={
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Novo processo
                </Button> */}
              </Stack>
            </Stack>
            <Card>
              <ProductListSearch onFiltersChange={handleFiltersChange} />
              <ProcessListTable
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={search.page}
                products={products}
                productsCount={productsCount ?? 0}
                rowsPerPage={search.rowsPerPage}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

ListaProcessos.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ListaProcessos;
