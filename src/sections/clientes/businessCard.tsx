import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";

import { PropertyList } from "@/components/property-list";

import { maskDocument } from "@/utils/masks/maskDocument";
import { phoneMask } from "@/utils/masks/phoneMask";

export const BusinessCard = ({ customer }: any): JSX.Element => {
  const business = customer?.business;
  const isBusiness = business?.document?.length >= 1;

  if (!isBusiness) {
    return null;
  }

  const address = `${business?.address.street}, ${business?.address.number}${
    business?.address.complement ? `, ${business?.address.complement}` : ""
  }, ${business?.address.neighborhood}, ${business?.address.city}, ${
    business?.address.state
  } - ${business?.address.postalCode}`;

  return (
    <>
      <Box py={1} px={2}>
        <Typography variant="subtitle2">Dados da empresa</Typography>
      </Box>
      <Divider />
      <PropertyList>
        <ListItem divider>
          <ListItemText
            primary={<Typography variant="subtitle2">Razão social</Typography>}
            secondary={business?.corporateName}
          />
        </ListItem>
        <ListItem divider>
          <ListItemText
            primary={<Typography variant="subtitle2">CNPJ</Typography>}
            secondary={maskDocument(business.document)}
          />
          <ListItemText
            primary={<Typography variant="subtitle2">CNAE</Typography>}
            secondary={business?.cnae}
          />
        </ListItem>

        <ListItem divider>
          {business?.email && (
            <ListItemText
              primary={<Typography variant="subtitle2">E-mail</Typography>}
              secondary={business.email}
            />
          )}
        </ListItem>
        <ListItem divider>
          {business?.phone && (
            <ListItemText
              primary={<Typography variant="subtitle2">Telefone</Typography>}
              secondary={phoneMask(business.phone)}
            />
          )}
        </ListItem>
        <ListItem divider>
          <ListItemText
            primary={<Typography variant="subtitle2">Endreço</Typography>}
            secondary={address}
          />
        </ListItem>
      </PropertyList>
    </>
  );
};
