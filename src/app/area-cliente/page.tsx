import * as React from "react";
import { Box, Stack, Container } from "@mui/material";

import { WrapperClient } from "@/components/clientes/wrapper-file";
import { Breadcrumbs } from "@/components/core/breadcrumbs";

export default function Page() {
  return (
    <Box component="main" sx={{ flexGrow: 1, pt: 3 }}>
      <Container maxWidth="xl">
        <Stack spacing={2}>
          <Breadcrumbs />
          <WrapperClient />
        </Stack>
      </Container>
    </Box>
  );
}
