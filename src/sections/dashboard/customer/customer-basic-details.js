import {
  Box,
  Card,
  Divider,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { PropertyList } from "../../../components/property-list";
import { maskDocument } from "../../../utils/masks/maskDocument";
import { phoneMask } from "@/utils/masks/phoneMask";
export const CustomerBasicDetails = ({ customer }) => {
  const hasCnpj = customer?.business?.document?.length >= 1;

  console.log(customer)

  const hasComplement =
    customer?.address?.complement || customer?.businessComplement?.length >= 1
      ? `, ${customer?.address?.complement || customer?.businessComplement}, `
      : "";

  const business = customer?.business;
  const businessAddress = `${business?.address.street}, ${business?.address.number}${hasComplement}, ${business?.address.neighborhood}, ${business?.address.city}, ${business?.address.state} - ${business?.address.postalCode}`;

  const address = `${customer?.address?.street}, ${customer?.address?.number} ${
    hasComplement ?? ""
  } ${customer?.address?.neighborhood}, ${customer?.address?.state} - ${
    customer?.address?.postalCode
  }`;

  return (
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
            <ListItem divider>
              <ListItemText
                primary="Endereço"
                secondary={businessAddress.toLowerCase()}
              />
            </ListItem>

            <ListItem divider>
              {business?.email && (
                <ListItemText primary="E-mail" secondary={business.email} />
              )}
            </ListItem>
            <ListItem divider>
              {business?.phone && (
                <ListItemText
                  primary="Telefone"
                  secondary={phoneMask(business.phone)}
                />
              )}
            </ListItem>
          </PropertyList>
        </>
      )}

      {!hasCnpj && (
        <>
          <Box px={2} pt={4} pb={2}>
            <Typography variant="h6">Dados do Cliente</Typography>
          </Box>
          <Divider />
          <PropertyList>
            <ListItem divider>
              <ListItemText
                primary="Nome Completo"
                secondary={customer?.name}
              />
            </ListItem>
            <ListItem divider>
              <ListItemText
                primary="CPF"
                secondary={maskDocument(customer?.document)}
              />
              <ListItemText primary="RG" secondary={customer?.rg} />
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Email" secondary={customer?.email} />
            </ListItem>
            <ListItem divider>
              <ListItemText
                primary="Telefone"
                secondary={phoneMask(customer?.phone)}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Endereço"
                secondary={address.toLowerCase()}
              />
            </ListItem>
          </PropertyList>
        </>
      )}
    </Card>
  );
};
