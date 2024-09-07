import { Box, Container, Stack } from "@mui/material";

import { NovoCliente } from "@/components/clientes/form/novo/novo";
import { Breadcrumbs } from "@/components/core/breadcrumbs";

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
          <Breadcrumbs />
          <NovoCliente customer={undefined} />
        </Stack>
      </Container>
    </Box>
  );
}
