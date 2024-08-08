import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  ListItem,
  ListItemText,
} from "@mui/material";
import { PropertyList } from "../../../components/property-list";
import { maskDocument } from "../../../utils/masks/maskDocument";
import FeeContractModal from "../contratos/fee-contract-modal";
import PowerOfAttorneyModal from "../contratos/power-of-attorney-modal";
import { useRouter } from "next/navigation";

export const CustomerBasicDetails = ({ customer }) => {
  const router = useRouter();
  const hasComplement =
    customer?.complement?.length >= 1 ? `${customer?.complement}, ` : "";
  const hasBusinessComplement =
    customer?.businessComplement?.length >= 1
      ? `${customer?.businessComplement}, `
      : "";

  const address = `${customer?.street}, ${customer?.number} ${hasComplement} ${customer?.neighborhood}, ${customer?.state} - ${customer?.postalCode}`;
  const bussinessAddress = `${customer?.businessStreet}, ${customer?.businessNumber} ${hasBusinessComplement}, ${customer?.businessNeighborhood}, ${customer?.businessState} - ${customer?.businessPostalCode}`;

  // const hasPaymentMode = financialData && financialData.payments;
  const hasCnpj = customer?.document?.length === 14;

  const [openContract, setOpenContract] = useState(false);
  const [openPoa, setOpenPoa] = useState(false);

  const handleToggleFeeContract = (isOpen) => setOpenContract(isOpen);
  const handleTogglePowerOfAttorney = (isOpen) => setOpenPoa(isOpen);
  const handleHyposufficiency = (id) => {
    // window.open(`/contratos/hipossuficiencia/${id}`, "_blank");
    router.push(`/contratos/hipossuficiencia/${id}`)
  };

  return (
    <>
      <Card>
        <CardHeader title="Detalhes Básicos" />

        {hasCnpj && (
          <>
            <PropertyList>
              <ListItem divider>
                <ListItemText
                  primary="Empresa"
                  secondary={data?.corporateName}
                />
              </ListItem>
              <ListItem divider>
                <ListItemText
                  primary="CNPJ"
                  secondary={maskDocument(data?.cnpj)}
                />
                <ListItemText primary="CNAE" secondary={data?.cnae} />
              </ListItem>
              <ListItem divider>
                <ListItemText primary="Endereço" secondary={bussinessAddress} />
              </ListItem>
            </PropertyList>
            {/* <Stack
              sx={{
                padding: "16px 0 0 16px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle1">Responsável</Typography>
            </Stack> */}
          </>
        )}
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
          <ListItem divider sx={{ flexDirection: "column", gap: 1, mt: 1 }}>
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
          </ListItem>
        </PropertyList>
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
