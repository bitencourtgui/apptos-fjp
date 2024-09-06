import * as React from "react";
import { Box, Stack, Container } from "@mui/material";
import { GET_DOCUMENT } from "@/graphql/queries/getUser";

import { WrapperClient } from "@/components/clientes/wrapper-file";
import { Breadcrumbs } from "@/components/core/breadcrumbs";
import { ClientUpload } from "@/lib/apollo/client";

export default async function Page() {
  // const { data } = await ClientUpload.query({
  //   query: GET_DOCUMENT,
  //   variables: { id: "e19f78e0fd02645de313ae142e4cc5e0c74e42a0da2cea952" },
  // });

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, pt: 3 }}>
        <Container maxWidth="xl">
          <Stack spacing={2}>
            <Breadcrumbs />
            <WrapperClient />
          </Stack>
        </Container>
      </Box>
    </>
  );
}
