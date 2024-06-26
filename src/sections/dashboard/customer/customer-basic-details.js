/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  FormGroup,
  ListItem,
  ListItemText,
  SvgIcon,
  Typography,
} from "@mui/material";
import { PropertyList } from "../../../components/property-list";
import { maskDocument } from "../../../utils/masks/maskDocument";
import FeeContractModal from "../contacts/fee-contract-modal";
import PowerOfAttorneyModal from "../contacts/power-of-attorney-modal";
import ChevronDown from "@untitled-ui/icons-react/build/esm/ChevronDown";
import ChevronUp from "@untitled-ui/icons-react/build/esm/ChevronUp";
import { Scrollbar } from "../../../components/scrollbar";
import CustomersApi from "../../../api/customers";
export const CustomerBasicDetails = ({ customer }) => {
  const hasCnpj = customer?.business?.document.length >= 1;

  const hasComplement =
    customer?.address?.complement || customer?.businessComplement?.length >= 1
      ? `, ${customer?.address?.complement || customer?.businessComplement}, `
      : "";

  const business = customer?.business;
  const businessAddress = `${business?.address.street}, ${business?.address.number}${hasComplement}, ${business?.address.neighborhood}, ${business?.address.city}, ${business?.address.state} - ${business?.address.postalCode}`;

  const address = `${customer?.address?.street}, ${customer?.address?.number} ${hasComplement} ${customer?.address?.neighborhood}, ${customer?.address?.state} - ${customer?.address?.postalCode}`;

  const [openContract, setOpenContract] = useState(false);
  const [openPoa, setOpenPoa] = useState(false);

  const handleToggleFeeContract = (isOpen) => setOpenContract(isOpen);
  const handleTogglePowerOfAttorney = (isOpen) => setOpenPoa(isOpen);

  const [open, setOpen] = useState(!hasCnpj);
  const [servicesOpen, setServicesOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleServicesClick = () => {
    setServicesOpen(!servicesOpen);
  };

  const getArrowIcon = (isOpen) => (isOpen ? <ChevronUp /> : <ChevronDown />);

  const [selectedServices, setSelectedServices] = useState(
    customer?.services || []
  );

  // useEffect(() => {
  //   const customerId = customer?.id;
  //   const values = { ...customer };

  //   console.log("selectedServices", selectedServices);

  //   if (selectedServices && selectedServices.length > 0) {
  //     values.services = selectedServices;
  //     setCustomerData();
  //   }

  //   async function setCustomerData() {
  //     try {
  //       const response = await CustomersApi.setCustomer(customerId, values);
  //       console.info(response);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // }, [selectedServices]);

  const handleServiceToggle = (service) => {
    setSelectedServices((prevServices) => {
      if (prevServices.includes(service)) {
        return prevServices.filter((s) => s !== service);
      } else {
        return [...prevServices, service];
      }
    });
  };

  return (
    <>
      <Card>
        {hasCnpj && (
          <>
            <Box px={2} pt={4} pb={2}>
              <Typography variant="h6">Dados da empresa</Typography>
            </Box>
            <Divider />

            <PropertyList>
              <ListItem divider>
                <ListItemText
                  primary="Razão social"
                  secondary={business?.corporateName}
                />
              </ListItem>
              <ListItem divider>
                <ListItemText
                  primary="CNPJ"
                  secondary={maskDocument(business.document)}
                />
                <ListItemText primary="CNAE" secondary={business?.cnae} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Endereço" secondary={businessAddress} />
              </ListItem>

              <ListItem divider>
                {business?.email && (
                  <ListItemText primary="E-mail" secondary={business.email} />
                )}
              </ListItem>
              <ListItem divider>
                {business?.phone && (
                  <ListItemText primary="Telefone" secondary={business.phone} />
                )}
              </ListItem>
            </PropertyList>
          </>
        )}

        {/* <Box
          px={2}
          pt={4}
          pb={2}
          display="flex"
          justifyContent="space-between"
          onClick={handleServicesClick}
        >
          <Typography variant="h6">Serviços</Typography>
          <SvgIcon sx={{ mr: 1 }}>{getArrowIcon(servicesOpen)}</SvgIcon>
        </Box> */}
        {/* <Divider />
        <Collapse in={servicesOpen}>
          <div>
            <Box
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "neutral.800" : "neutral.50",
                borderColor: "divider",
                borderRadius: 1,
                borderStyle: "solid",
                borderWidth: 1,
              }}
            >
              <Scrollbar sx={{ maxHeight: 200 }}>
                <FormGroup
                  sx={{
                    py: 1,
                    px: 1.5,
                  }}
                >
                  {services.map((service, index) => {
                    const isChecked = selectedServices.includes(service.value);
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleServiceToggle(service.value)}
                          />
                        }
                        key={index}
                        label={service.label}
                        value={service.value}
                      />
                    );
                  })}
                </FormGroup>
              </Scrollbar>
            </Box>
          </div>
        </Collapse> */}
      </Card>
      <FeeContractModal
        open={openContract}
        handleToggle={handleToggleFeeContract}
        source={customer}
      />
      <PowerOfAttorneyModal
        open={openPoa}
        handleToggle={handleTogglePowerOfAttorney}
        source={customer}
      />
    </>
  );
};
