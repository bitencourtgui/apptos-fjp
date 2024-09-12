"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";

import { Breadcrumbs } from "@/components/core/breadcrumbs";
import { JuridicoBusca } from "@/components/juridico/juridico-busca";
import { ProcessListTable } from "@/components/juridico/juridico-tabela";
import { useCustomers } from "@/hooks/use-customers";

export default function Page(): React.JSX.Element {
 const customers: any = []

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h4">Juridico</Typography>
              <Breadcrumbs />
            </Stack>
          </Stack>
          <Card>
            <JuridicoBusca />
            <ProcessListTable
              onPageChange={() => console.log("onPageChange")}
              onRowsPerPageChange={() => console.log("onPageChange")}
              page={1}
              products={customers}
              productsCount={0}
              rowsPerPage={10}
            />
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
