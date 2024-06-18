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
import { FormikProps, useFormik } from "formik";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import { OpeningService } from "./forms/openingService";
import { AccountingService } from "./forms/accountingService";

// so para subir corrigir para o certo
import { partnersInitial } from "../customer/Partners/partners-initial";
import { customersSchema } from "../customer/customer-schema";
import { openingServiceSchema } from "./services.schema";
import { iOpeningService } from "./financial-initial";
import CustomersApi from "@/api/customers";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

interface ServicesModalProps {
  open: boolean;
  handleToggle: () => void;
  customers: any;
  reload: any
}

const ServicesModal = ({
  open,
  handleToggle,
  customers,
  reload
}: ServicesModalProps) => {
  dayjs.locale("pt-br");

  const [service, setService] = useState("0");

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

  // rever imports
  const formik = useFormik({
    initialValues: iOpeningService,
    validationSchema: openingServiceSchema,
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
              <MenuItem value="0">Abertura de Empresa</MenuItem>
              <MenuItem value="1">Contabilidade Empresarial</MenuItem>
              <MenuItem value="2">Desencadeamento</MenuItem>
              <MenuItem value="3">Planejamento Tributário</MenuItem>
              <MenuItem value="4">Isenção de IR</MenuItem>
              <MenuItem value="5">Defesa Administrativa</MenuItem>
            </Select>
          </FormControl>

          <Box p={2}>
            <Divider orientation="horizontal" />
          </Box>
          {service === "0" && <OpeningService {...formik} />}
          {service === "1" && <AccountingService {...formik} />}
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
