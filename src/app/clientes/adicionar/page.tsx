import {
  Box,
  Container,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";

import NextLink from "next/link";

import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { NovoCliente } from "@/components/clientes/form/novo/novo";

export default function Page(): React.JSX.Element {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 6,
      }}
    >
      <Container maxWidth={false}>
        <Stack spacing={4}>
          <Stack spacing={4}>
            <Link
              color="text.primary"
              component={NextLink}
              href="/clientes"
              sx={{
                alignItems: "center",
                display: "inline-flex",
              }}
              underline="hover"
            >
              <ArrowLeftIcon />
              <Typography variant="subtitle2">Clientes</Typography>
            </Link>
          </Stack>
          <NovoCliente customer={undefined} />
        </Stack>
      </Container>
    </Box>
  );
}
