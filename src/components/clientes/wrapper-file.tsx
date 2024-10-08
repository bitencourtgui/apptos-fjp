"use client";

import {
  Button,
  Chip,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Breadcrumbs } from "@/components/core/breadcrumbs";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/Trash01";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import { BasicDetails } from "@/components/clientes/detalhes-basicos/detalhes-basicos";
import FileManager from "@/components/clientes/file-manager";
import { ContractList } from "@/components/contratos/contratos";
import { ServicesList } from "@/components/servicos/servicos";
import { BusinessAlert } from "@/components/clientes/business-alert";
import { useParams, useRouter } from "next/navigation";
import { useCustomerById } from "@/hooks/use-customers";
import React from "react";
import NextLink from "next/link";
import { BusinessInteraction } from "./business-interaction";
import { SociosList } from "../socios/socios";
import { JuridicoList } from "../juridico/juridico";
import { useUser } from "@/hooks/use-user";
import { useUserByEmail, useUser as useUsers } from "@/hooks/use-users";
import { toast } from "@/components/core/toaster";

const tabs = [
  { label: "Detalhes", value: "details" },
  { label: "Contratos", value: "contracts" },
  { label: "Serviços", value: "services" },
  { label: "Sócios", value: "partners" },
  { label: "Processos", value: "legal" },
];

export const WrapperClient = () => {
  const { customerId } = useParams();
  const router = useRouter();

  const { user } = useUser();
  const { client } = useUserByEmail(String(user?.email));

  const customerIdData = customerId ? String(customerId) : client?.id;

  const isClient = customerId ? false : true;

  const { customers, deleteCustomer, reload } = useCustomerById(customerIdData);

  const [open, setOpen] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState("details");

  const customerName = customers?.business?.corporateName || customers?.name;

  const isBusiness = customers?.business?.corporateName.length > 1;

  const handleDelete = async () => {
    try {
      const response = await deleteCustomer(); // Chama a função deleteCustomer
      if (response.status === 200) {
        toast.success("Cliente excluído com sucesso!");
        router.push(`/clientes/`); // Redireciona para a página de clientes
      } else {
        throw new Error(response.message || "Erro desconhecido");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Erro: ${err.message}`);
        toast.error(`Erro ao deletar cliente: ${err.message}`);
      } else {
        console.error("Erro desconhecido");
        toast.error("Erro desconhecido ao deletar cliente");
      }
    }
  };
  

  const handleTabsChange = React.useCallback(
    (_: any, value: React.SetStateAction<string>) => {
      setCurrentTab(value);
    },
    [],
  );

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
              <Chip label={`ID: ${customers?.id}`} size="small" />
            </Stack>
          </Stack>
        </Stack>
        {!isClient && (
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
              href={`/clientes/${customers?.id}/editar`}
            >
              Editar
            </Button>
          </Stack>
        )}
      </Stack>
      <BusinessAlert isBusiness={isBusiness} handleToggle={handleToggle} />
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
          <BasicDetails customer={customers} />
          <Grid xs={12} lg={8}>
            <Stack spacing={4}>
              {customers && (
                <FileManager customerId={customers.id} isClient={isClient} />
              )}
            </Stack>
          </Grid>
        </Grid>
      )}
      {currentTab === "contracts" && (
        <ContractList {...customers} isClient={isClient} />
      )}
      {currentTab === "services" && (
        <ServicesList id={customers?.id} isClient={isClient} />
      )}
      {currentTab === "partners" && isBusiness && (
        <SociosList
          getCustomer={reload}
          customers={customers}
          isClient={isClient}
        />
      )}
      {currentTab === "legal" && (
        <JuridicoList
          id={customers?.id}
          name={customerName}
          isClient={isClient}
        />
      )}
      <BusinessInteraction
        open={open}
        handleToggle={handleToggle}
        customers={customers}
      />
    </>
  );
};
