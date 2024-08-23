import React, { useCallback, useEffect, useState } from "react";
import NextLink from "next/link";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/Trash01";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import {
  Box,
  Button,
  Chip,
  Container,
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
import customersApi from "@/api/customers";
import { Layout as DashboardLayout } from "@/layouts/dashboard";
import { ServicesList } from "@/sections/dashboard/services/services-list";
import FileManager from "@/components/FileManager";
import { CustomerPartners } from "@/sections/dashboard/customer/customer-partners";
import { ContractListOld } from "@/sections/dashboard/customer/customer-contracts";
import LegalModal from "@/sections/dashboard/customer/LegalPerson/modal";
import { useFormik } from "formik";
import { customersInitial } from "@/sections/dashboard/customer/customer-initial";
import { businessSchema } from "@/sections/dashboard/customer/customer-schema";
import CustomersApi from "@/api/customers";
import { ProcessList } from "@/sections/dashboard/process/process-list";
import { useCustomer } from "@/hooks/useCustomer";
import { Head } from "@/components/Head";
import { BusinessAlert } from "@/components/businessAlert";
import { BasicDetails } from "@/sections/clientes/basicDetails";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContractList } from "@/sections/contratos";

const tabs = [
  { label: "Detalhes", value: "details" },
  { label: "Contratos", value: "contracts" },
  { label: "Serviços", value: "services" },
  { label: "Sócios", value: "partners" },
  { label: "Processos", value: "legal" },
];

const DetalhesCliente = () => {
  const router = useRouter();

  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId ?? "";

  const [currentTab, setCurrentTab] = useState("details");
  const { customer, getCustomer } = useCustomer(userId);

  const handleTabsChange = useCallback((_, value) => {
    setCurrentTab(value);
  }, []);

  const handleDelete = async () => {
    try {
      const response = await customersApi.deleteCustomer(userId);
      if (response.status === 200) {
        toast.success("Cliente excluído");
        router.push(`/clientes`);
      }
    } catch (err) {
      toast.error(`Erro: ${err}`);
    }
  };

  const removeUndefined = (obj) => {
    return Array.isArray(obj)
      ? obj.map((item) => removeUndefined(item))
      : Object.fromEntries(
          Object.entries(obj)
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, v === Object(v) ? removeUndefined(v) : v])
        );
  };

  const onSubmit = async (values, helpers) => {
    const customerToPartner = [
      {
        address: customer?.address,
        document: customer?.document,
        gender: customer?.gender,
        managingPartner: true,
        maritalStatus: customer?.maritalStatus,
        name: customer?.name,
        nationality: customer?.nationality,
        occupation: customer?.occupation,
        rg: customer?.rg,
      },
    ];

    const payload = {
      ...customer,
      business: values.business,
      partners: customerToPartner,
    };

    const sanitizedPayload = removeUndefined(payload);
    try {
      const response = await CustomersApi.updateCustomer(
        customer.id,
        sanitizedPayload
      );

      if (response.status === 200) {
        toast.success("Empresa cadastrada");
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        window.location.reload();
      } else {
        console.error("[ERROR] CAD-EMPRESA1", response);
      }
    } catch (err) {
      console.error("[ERROR] CAD-EMPRESA2", err);
      toast.error("Falha ao cadastrar empresa");
      helpers.setStatus({ success: false });
      helpers.setErrors({ submit: err.message });
      helpers.setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: customersInitial,
    validationSchema: businessSchema,
    onSubmit,
  });

  const [hasServices, setHasServices] = useState<boolean>(false);
  const isBusiness = customer?.business?.corporateName.length > 1;

  useEffect(() => {
    if (!hasServices) {
      setHasServices(customer?.services?.length > 0);
    }
  }, [customer, hasServices]);

  const customerName = customer?.business?.corporateName || customer?.name;

  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const filteredTabs = tabs.filter((tab) => {
    if (tab.value === "partners" && !isBusiness) {
      return false;
    }
    return true;
  });

  return (
    <>
      <Head page={customerName} />
      <Box component="main" sx={{ flexGrow: 1, pt: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={2}>
            <Breadcrumbs />
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
                  size="small"
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
                  size="small"
                  variant="contained"
                  component={NextLink}
                  href={`/clientes/${customer?.id}/editar`}
                >
                  Editar
                </Button>
              </Stack>
            </Stack>
            <BusinessAlert
              isBusiness={isBusiness}
              handleToggle={handleToggle}
            />
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              sx={{ mt: 1 }}
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {filteredTabs.map((tab, key) => (
                <Tab key={key} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
            {currentTab === "details" && (
              <Grid container>
                <BasicDetails customer={customer} />
                <Grid xs={12} lg={8}>
                  <Stack spacing={4}>
                    {hasServices && (
                      <ContractListOld
                        customer={customer}
                        hasServices={hasServices}
                      />
                    )}
                    {customer && <FileManager customerId={customer.id} />}
                  </Stack>
                </Grid>
              </Grid>
            )}

            {currentTab === "contracts" && <ContractList {...customer} />}
            {currentTab === "services" && <ServicesList id={customer?.id} />}
            {currentTab === "partners" && isBusiness && (
              <CustomerPartners
                getCustomer={getCustomer}
                customers={customer}
              />
            )}
            {currentTab === "legal" && <ProcessList {...customer} />}
          </Stack>
        </Container>
      </Box>
      <LegalModal formik={formik} open={open} handleToggle={handleToggle} />
    </>
  );
};

DetalhesCliente.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DetalhesCliente;
