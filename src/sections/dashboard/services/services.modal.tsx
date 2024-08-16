import React, { useState } from "react";
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
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useFormik } from "formik";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import { OpeningService } from "./forms/openingService";
import { AccountingService } from "./forms/accountingService";

// so para subir corrigir para o certo
import {
  AccountingServiceSchema,
  openingServiceSchema,
} from "./services.schema";
import { iAccountingService, iOpeningService } from "./financial-initial";
import CustomersApi from "@/api/customers";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

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

  const [service, setService] = useState("10");

  const onSubmit = async (values, helpers) => {
    values.serviceType = service;
    values.createdAt = dayjs().format("DD/MM/YYYY");
    values.id = uuidv4();

    const payload = {
      ...customers,
      services: [...(customers.services || []), values],
    };

    const response = await CustomersApi.updateCustomer(customers.id, payload);

    if (response.status === 200) {
      handleToggle();
      reload();
      toast.success("Serviço cadastrado");
      helpers.setStatus({ success: true });
    } else {
      throw new Error("Unexpected response status");
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
    : [
        { value: "0", label: "Abertura de Empresa" },
        ...defaultOptions,
      ];
  

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
        return null;
    }
  }

  // rever imports
  const formik = useFormik({
    initialValues: getInitial(service),
    validationSchema: getSchema(service),
    onSubmit,
  });

  const handleChange = (event) => {
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
          <CloseOutlinedIcon />
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
