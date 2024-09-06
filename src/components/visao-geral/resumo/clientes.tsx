"use client";

import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import {
  Box,
  Button,
  Card,
  CardActions,
  Divider,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useCustomers } from "@/hooks/use-customers";

export const ResumoClientes = () => {
  const { customers } = useCustomers();

  return (
    <Card>
      <Stack
        alignItems="center"
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={3}
        sx={{
          px: 4,
          py: 3,
        }}
      >
        <div>
          <Image
            src="/assets/icons/resumo-clientes.svg"
            width={48}
            height={48}
            alt="icone resumo de clientes"
          />
        </div>
        <Box sx={{ flexGrow: 1 }}>
          <Typography color="text.secondary" variant="body2">
            Clientes
          </Typography>
          <Typography color="text.primary" variant="h4">
            {customers.length}
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <CardActions>
        <Button
          color="inherit"
          href="/clientes"
          endIcon={
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
        >
          Veja todos os clientes
        </Button>
      </CardActions>
    </Card>
  );
};
