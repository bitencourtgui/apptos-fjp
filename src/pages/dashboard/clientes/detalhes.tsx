/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import NextLink from "next/link";
import Head from "next/head";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/Trash01";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import customersApi from "../../../api/customers";
import { useMounted } from "../../../hooks/use-mounted";
import { usePageView } from "../../../hooks/use-page-view";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import { CustomerBasicDetails } from "../../../sections/dashboard/customer/customer-basic-details";
import { FinancialList } from "../../../sections/dashboard/financial/financial-list";
import { ProcessList } from "../../../sections/dashboard/process/process-list";
import { useAuth } from "../../../hooks/use-auth";
import FileManager from "../../../components/FileManager";
import CustomersApi from "../../../api/customers";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const tabs = [
  { label: "Detalhes", value: "details" },
  { label: "Financeiro", value: "invoices" },
  { label: "Processos", value: "logs" },
];

const useCustomer = (userId: string) => {
  const isMounted = useMounted();

  const [customer, setCustomer] = useState(null);

  const getCustomer = useCallback(async () => {
    try {
      const response = await customersApi.getCustomer(userId.toString());

      if (isMounted()) {
        setCustomer(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getCustomer();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return { customer, getCustomer };
};

const DetalhesClienteDash = ({ userId }: { userId: string }) => {
  const [currentTab, setCurrentTab] = useState("details");
  const { customer, getCustomer } = useCustomer(userId);
  const { getTenant } = useAuth();
  const gt = getTenant();
  const Router = useRouter();

  usePageView();

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const handleDelete = async () => {
    try {
      const response = await CustomersApi.deleteCustomer(userId);

      if (response.status === 200) {
        toast.success("Cliente excluido");
        Router.push(`/${gt}/clientes`);
      }
    } catch (err) {
      toast.error(`Erro: ${err}`);
    }
  };

  return (
    <>
      <Head>
        <title>{customer?.name} | FJP</title>
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
            <Stack spacing={4}>
              <div>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={`/${gt}/clientes`}
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
                  <Stack spacing={1}>
                    <Typography variant="h4">{customer?.name}</Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">id:</Typography>
                      <Chip label={customer?.id} size="small" />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Button
                    color="inherit"
                    onClick={() => handleDelete()}
                    endIcon={
                      <SvgIcon>
                        <ChevronDownIcon />
                      </SvgIcon>
                    }
                  >
                    Excluir
                  </Button>
                  <Button
                    endIcon={
                      <SvgIcon>
                        <Edit02Icon />
                      </SvgIcon>
                    }
                    variant="contained"
                    component={NextLink}
                    href={`/${gt}/clientes/${customer?.id}/editar`}
                  >
                    Editar
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Tabs
                  indicatorColor="primary"
                  onChange={handleTabsChange}
                  scrollButtons="auto"
                  sx={{ mt: 3 }}
                  textColor="primary"
                  value={currentTab}
                  variant="scrollable"
                >
                  {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                  ))}
                </Tabs>
                <Divider />
              </div>
            </Stack>
            {currentTab === "details" && (
              <div>
                <Grid container spacing={4}>
                  <Grid xs={12} lg={4}>
                    <CustomerBasicDetails customer={customer} />
                  </Grid>
                  <Grid xs={12} lg={8}>
                    <Stack spacing={4}>
                      {customer && <FileManager customerId={customer.id} />}
                      {/* <CustomerEmailsSummary /> */}
                      {/* <CustomerDataManagement /> */}
                    </Stack>
                  </Grid>
                </Grid>
              </div>
            )}
            {currentTab === "invoices" && <FinancialList id={customer.id} />}
            {currentTab === "logs" && <ProcessList {...customer} />}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

DetalhesClienteDash.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default DetalhesClienteDash;
