/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Button,
  CardActions,
  CardContent,
  DialogTitle,
  IconButton,
  Drawer,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import XClose from "@untitled-ui/icons-react/build/esm/XClose";
import { toast } from "@/components/core/toaster";
import { useFormik } from "formik";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { updateCustomerAPI } from "@/api/customers";

import { v4 as uuidv4 } from "uuid";
import { transformContractPayload } from "@/transforms/contract";
import { AccountingServiceSchema, openingServiceSchema } from "./form/schema";
import { iAccountingService, iOpeningService } from "./form/inital";
import { useContract } from "@/hooks/use-contracts";
import { OpeningService } from "./form/openingService";
import { AccountingService } from "./form/accountingService";

interface ServicesModalProps {
  open: boolean;
  handleToggle: () => void;
  customers: any;
  reload: any;
}

const ServicesModal = ({
  open,
  handleToggle,
  customers,
  reload,
}: ServicesModalProps) => {
  dayjs.locale("pt-br");

  const isBusiness = customers?.business?.corporateName?.length > 1;
  const contractId = uuidv4();
  const { createContract } = useContract(contractId);

  const [service, setService] = useState("10");

  const onSubmit = async (values: any, helpers: any) => {
    values.serviceType = service;
    values.createdAt = dayjs().format("DD/MM/YYYY");
    values.id = uuidv4();

    let updatedPayload = {
      ...customers,
      services: [...(customers.services || []), values],
    };

    try {
      const result = await updateCustomerAPI(customers.id, updatedPayload);

      if (service === "0" && !isBusiness) {
        const transformedPayload = transformContractPayload(updatedPayload);
        const response = await createContract(transformedPayload);

        if (response.status === 200) {
          console.info("Contrato gerado e salvo com sucesso");
        } else {
          console.error("Erro ao salvar o contrato");
        }
      }

      if (result.success) {
        handleToggle();
        reload();
        toast.success("Serviço cadastrado");
        helpers.setStatus({ success: true });
      } else {
        console.error("[ERROR] CADSERVICES", result);
      }
    } catch (err) {
      helpers.setStatus({ success: false });

      if (err instanceof Error) {
        helpers.setErrors({ submit: err.message });
      } else {
        helpers.setErrors({ submit: "Ocorreu um erro desconhecido." });
      }

      helpers.setSubmitting(false);
      toast.error("Erro ao cadastrar serviço");
    }
  };

  const defaultOptions = [{ value: "10", label: "Outros Serviços" }];

  const serviceOptions = isBusiness
    ? [
        { value: "1", label: "Contabilidade Empresarial" },
        { value: "2", label: "Desenquadramento" },
        { value: "3", label: "Planejamento Tributário" },
        { value: "4", label: "Isenção de IR" },
        { value: "5", label: "Defesa Administrativa" },
        ...defaultOptions,
      ]
    : [{ value: "0", label: "Abertura de Empresa" }, ...defaultOptions];

  function getSchema(service: string) {
    switch (service) {
      case "0":
        return openingServiceSchema;
      case "1":
        return AccountingServiceSchema;
      default:
        return null;
    }
  }

  function getInitial(service: string) {
    switch (service) {
      case "0":
        return iOpeningService;
      case "1":
        return iAccountingService;
      default:
        return {};
    }
  }

  const formik = useFormik({
    initialValues: getInitial(service),
    validationSchema: getSchema(service),
    onSubmit,
  });

  useEffect(() => {
    formik.setValues(getInitial(service));
    formik.setErrors({});
    formik.setTouched({});
  }, [service]);

  const handleChange = (event: any) => {
    setService(event.target.value);
  };

  return (
    <Drawer open={open} anchor="right" onClose={() => handleToggle()}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>Serviços</Typography>
        <IconButton
          aria-label="delete"
          onClick={() => handleToggle()}
          sx={{ padding: "0" }}
        >
          <XClose />
        </IconButton>
      </DialogTitle>
      <Divider />

      <form onSubmit={formik.handleSubmit}>
        <CardContent
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            width: "380px",
            gap: "8px",
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="service">Serviços</InputLabel>
            <Select
              labelId="service"
              id="service"
              name="service"
              value={service}
              label="Serviços"
              onChange={handleChange}
            >
              {serviceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box p={2}>
            <Divider orientation="horizontal" />
          </Box>
          {service === "0" && <OpeningService {...formik} />}
          {service === "1" && <AccountingService {...formik} />}
          {service === "2" && <OpeningService {...formik} />}
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", px: 3 }}>
          <Button fullWidth type="submit" variant="contained">
            Cadastrar
          </Button>
        </CardActions>
      </form>
    </Drawer>
  );
};

export default ServicesModal;
