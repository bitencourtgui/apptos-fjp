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
  const hasComplement =
    customer?.address?.complement || customer?.businessComplement?.length >= 1
      ? `, ${customer?.address?.complement || customer?.businessComplement}, `
      : "";

  const business = customer?.business;

  const businessAddress = `${business?.address.street}, ${business?.address.number}${hasComplement}, ${business?.address.neighborhood}, ${business?.address.city}, ${business?.address.state} - ${business?.address.postalCode}`;

  const address = `${customer?.address.street}, ${customer?.address.number} ${hasComplement} ${customer?.address.neighborhood}, ${customer?.address.state} - ${customer?.address.postalCode}`;

  const hasCnpj = customer?.document?.length === 14;

  const [openContract, setOpenContract] = useState(false);
  const [openPoa, setOpenPoa] = useState(false);

  const handleToggleFeeContract = (isOpen) => setOpenContract(isOpen);
  const handleTogglePowerOfAttorney = (isOpen) => setOpenPoa(isOpen);
  const handleHyposufficiency = (id) => {
    window.open(`/contracts/hyposufficiency/${id}`, "_blank");
  };

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const [servicesOpen, setServicesOpen] = useState(false);

  const handleServicesClick = () => {
    setServicesOpen(!servicesOpen);
  };

  const getArrowIcon = (isOpen) => (isOpen ? <ChevronDown /> : <ChevronUp />);

  const services = [
    { label: "Abertura de Empresa", value: "1" },
    { label: "Desencadeamento", value: "2" },
    { label: "Contabilidade Empresarial", value: "3" },
    { label: "Planejamento Tributário", value: "4" },
    { label: "Isenção de IR", value: "5" },
    { label: "Defesa Administrativa", value: "6" },
  ];

  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    // Log the selected services
    console.log(selectedServices);

    const customerId = customer?.id
    const values = { ...customer, services: selectedServices };

    console.log(values)
  
    // Define the async function inside the effect
    async function setCustomerData() {
      try {
        // Perform your async operation here
        const response = await CustomersApi.setCustomer(customerId, values);
        // Handle the response if needed
        console.log(response);
      } catch (error) {
        // Handle errors if needed
        console.error(error);
      }
    }
    
    // Call the async function
    setCustomerData();
  }, [selectedServices]); // Dependency array

  console.log(customer)

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
                  secondary={maskDocument(customer?.cnpj)}
                />
                <ListItemText primary="CNAE" secondary={business?.cnae} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Endereço" secondary={businessAddress} />
              </ListItem>
            </PropertyList>
          </>
        )}
        <Box
          px={2}
          pt={4}
          pb={2}
          display="flex"
          justifyContent="space-between"
          onClick={handleClick}
        >
          <Typography variant="h6">
            {hasCnpj ? "Dados do Responsável" : "Detalhes Básicos"}
          </Typography>
          <SvgIcon sx={{ mr: 1 }}>{getArrowIcon(open)}</SvgIcon>
        </Box>
        <Divider />
        <Collapse in={open}>
          <PropertyList>
            <ListItem divider>
              <ListItemText
                primary="CPF"
                secondary={maskDocument(customer?.cpf)}
              />
              <ListItemText primary="RG" secondary={customer?.rg} />
            </ListItem>
            {customer?.email && (
              <ListItem divider>
                <ListItemText primary="Email" secondary={customer?.email} />
              </ListItem>
            )}
            {customer?.phone1 && (
              <ListItem divider>
                <ListItemText primary="Telefone" secondary={customer?.phone1} />
              </ListItem>
            )}
            <ListItem divider>
              <ListItemText primary="Endereço" secondary={address} />
            </ListItem>
            {/*<ListItem divider sx={{ flexDirection: "column", gap: 1, mt: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleToggleFeeContract(true)}
            >
              Contrato de Honorários
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleTogglePowerOfAttorney(true)}
            >
              Procuração
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleHyposufficiency(customer?.id)}
            >
              Declaração de Hipossuficiencia
            </Button>
        </ListItem>*/}
          </PropertyList>
        </Collapse>
        <Box
          px={2}
          pt={4}
          pb={2}
          display="flex"
          justifyContent="space-between"
          onClick={handleServicesClick}
        >
          <Typography variant="h6">Serviços</Typography>
          <SvgIcon sx={{ mr: 1 }}>{getArrowIcon(servicesOpen)}</SvgIcon>
        </Box>
        <Divider />
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
        </Collapse>
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
