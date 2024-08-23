import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";

import { PropertyList } from "@/components/property-list";

import { maskDocument } from "@/utils/masks/maskDocument";
import { phoneMask } from "@/utils/masks/phoneMask";

export const PersonalCard = ({ customer }: any): JSX.Element => {
  const isBusiness = customer?.business?.document?.length >= 1;

  if (isBusiness) {
    return null;
  }

  const address = `${customer?.address.street}, ${customer?.address.number}${
    customer?.address?.complement ? `, ${customer?.address.complement}` : ""
  }, ${customer?.address.neighborhood}, ${customer?.address.city}, ${
    customer?.address.state
  } - ${customer?.address.postalCode}`;

  return (
    <>
      <Box py={1} px={2}>
        <Typography variant="subtitle2">Dados do cliente</Typography>
      </Box>
      <Divider />
      <PropertyList>
        <ListItem divider>
          <ListItemText
            primary={<Typography variant="subtitle2">Nome Completo</Typography>}
            secondary={customer?.name}
          />
        </ListItem>
        <ListItem divider>
          <ListItemText
            primary={<Typography variant="subtitle2">CPF</Typography>}
            secondary={maskDocument(customer?.document)}
          />
          <ListItemText
            primary={<Typography variant="subtitle2">RG</Typography>}
            secondary={customer?.rg}
          />
        </ListItem>

        <ListItem divider>
          {customer?.email && (
            <ListItemText
              primary={<Typography variant="subtitle2">E-mail</Typography>}
              secondary={customer?.email}
            />
          )}
        </ListItem>
        <ListItem divider>
          {customer?.phone && (
            <ListItemText
              primary={<Typography variant="subtitle2">Telefone</Typography>}
              secondary={phoneMask(customer?.phone)}
            />
          )}
        </ListItem>
        <ListItem divider>
          <ListItemText
            primary={<Typography variant="subtitle2">Endereço</Typography>}
            secondary={address}
          />
        </ListItem>
      </PropertyList>
    </>
  );
};
