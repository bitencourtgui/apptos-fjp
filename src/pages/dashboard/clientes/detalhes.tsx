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
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import customersApi from "../../../api/customers";
import { useMounted } from "../../../hooks/use-mounted";
import { usePageView } from "../../../hooks/use-page-view";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import { CustomerBasicDetails } from "../../../sections/dashboard/customer/customer-basic-details";
import { ServicesList } from "../../../sections/dashboard/services/services-list";
import { useAuth } from "../../../hooks/use-auth";
import FileManager from "../../../components/FileManager";
import { ContractList } from "../../../sections/dashboard/customer/customer-contracts";
import { CustomerPartners } from "@/sections/dashboard/customer/customer-partners";

const tabs = [
  { label: "Detalhes", value: "details" },
  { label: "Serviços", value: "services" },
  { label: "Sócios", value: "partners" },
  { label: "Assinar Documentos", value: "signDocuments" },
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
  }, [isMounted, userId]);

  useEffect(() => {
    getCustomer();
  }, [getCustomer]);

  return { customer, getCustomer };
};

const DetalhesClienteDash = ({ userId }: { userId: string }) => {
  const [currentTab, setCurrentTab] = useState("details");
  const { customer, getCustomer } = useCustomer(userId);
  const { getTenant } = useAuth();
  const tenant = getTenant();
  const router = useRouter();

  usePageView();

  const handleTabsChange = useCallback((_, value) => {
    setCurrentTab(value);
  }, []);

  const handleDelete = async () => {
    try {
      const response = await customersApi.deleteCustomer(userId);
      if (response.status === 200) {
        toast.success("Cliente excluído");
        router.push(`/${tenant}/clientes`);
      }
    } catch (err) {
      toast.error(`Erro: ${err}`);
    }
  };

  const customerName = customer?.business?.corporateName || customer?.name;

  return (
    <>
      <Head>
        <title>{customerName} | FJP</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Link
              color="text.primary"
              component={NextLink}
              href={`/${tenant}/clientes`}
              sx={{ alignItems: "center", display: "inline-flex" }}
              underline="hover"
            >
              <SvgIcon sx={{ mr: 1 }}>
                <ArrowLeftIcon />
              </SvgIcon>
              <Typography variant="subtitle2">Clientes</Typography>
            </Link>
            <Stack
              alignItems="flex-start"
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              spacing={4}
            >
              <Stack alignItems="center" direction="row" spacing={2}>
                <Stack spacing={1}>
                  <Typography variant="h4">{customerName}</Typography>
                  <Stack alignItems="center" direction="row" spacing={1}>
                    <Typography variant="subtitle2">id:</Typography>
                    <Chip label={customer?.id} size="small" />
                  </Stack>
                </Stack>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={2}>
                <Button
                  color="inherit"
                  onClick={handleDelete}
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
                  href={`/${tenant}/clientes/${customer?.id}/editar`}
                >
                  Editar
                </Button>
              </Stack>
            </Stack>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              sx={{ mt: 1 }}
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
            {currentTab === "details" && (
              <Grid container spacing={4}>
                <Grid xs={12} lg={4}>
                  <CustomerBasicDetails customer={customer} />
                </Grid>
                <Grid xs={12} lg={8}>
                  <Stack spacing={4}>
                    <ContractList customer={customer} />
                    {customer && <FileManager customerId={customer.id} />}
                  </Stack>
                </Grid>
              </Grid>
            )}
            {currentTab === "services" && <ServicesList id={customer?.id} />}
            {currentTab === "partners" && (
              <CustomerPartners
                getCustomer={getCustomer}
                customers={customer}
              />
            )}
            {currentTab === "signDocuments" && <>EM BREVE</>}
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
