import { Box, Container, Stack } from "@mui/material";

import { Breadcrumbs } from "@/components/core/breadcrumbs";
import { NovoProcesso } from "@/components/juridico/novo/novo";

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
          <NovoProcesso />
        </Stack>
      </Container>
    </Box>
  );
}
