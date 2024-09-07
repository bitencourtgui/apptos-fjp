"use client";

import * as React from "react";

import { Breadcrumbs } from "@/components/core/breadcrumbs";
import { useParams } from "next/navigation";
import { Avatar, Box, Chip, Container, Stack, Typography } from "@mui/material";
import { NovoCliente } from "@/components/clientes/form/novo/novo";
import { useCustomerById } from "@/hooks/use-customers";
import { getInitials } from "@/utils/get-initials";

export default function Page() {
  const { customerId } = useParams();
  const { customers } = useCustomerById(String(customerId));

  return (
    <Box component="main" sx={{ flexGrow: 1, pt: 3 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Breadcrumbs />
          <Stack
            alignItems="flex-start"
            direction={{
              xs: "column",
              md: "row",
            }}
            justifyContent="space-between"
            spacing={4}
          >
            <Stack alignItems="center" direction="row" spacing={2}>
              <Avatar
                sx={{
                  height: 64,
                  width: 64,
                }}
              >
                {getInitials(
                  customers?.name || customers?.business?.corporateName,
                )}
              </Avatar>
              <Stack spacing={1}>
                <Typography variant="h4">
                  {customers?.name || customers?.business?.corporateName}
                </Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography variant="subtitle2">id:</Typography>
                  <Chip label={customers?.id} size="small" />
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <NovoCliente customer={customers} />
        </Stack>
      </Container>
    </Box>
  );
}
