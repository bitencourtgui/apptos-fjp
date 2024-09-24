"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { Breadcrumbs } from "@/components/core/breadcrumbs";
import {
  IProcess,
  ProcessListTable,
} from "@/components/juridico/juridico-tabela";
import { useProcesses } from "@/hooks/use-processes";
import { JuridicoSelectionProvider } from "@/components/juridico/juridico-selection-context";
import { JuridicoFilters } from "@/components/juridico/juridico-filters";
import { JuridicoPagination } from "@/components/juridico/juridico-pagination";
import { MovimentsDrawer } from "@/components/juridico/modal/moviments";

interface PageProps {
  searchParams: {
    status?: string;
    number?: string;
    sortDir?: "asc" | "desc";
    document?: string;
  };
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
  const { status, number, sortDir } = searchParams;
  const { processes } = useProcesses();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [drawerProcess, setDrawerProcess] = useState<IProcess | null>(null);

  const filteredCustomers = applyFilters(processes, { status, number });

  const paginatedCustomers = applyPagination(
    filteredCustomers,
    page,
    rowsPerPage,
  );

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDrawer = (process: IProcess) => {
    setDrawerProcess(process); // Função para abrir o drawer
  };

  const handleDrawerClose = () => {
    setDrawerProcess(null); // Função para fechar o drawer
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Breadcrumbs />
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Typography variant="h4">Juridico</Typography>
            </Stack>
            <JuridicoSelectionProvider juridico={paginatedCustomers}>
              <Card>
                <JuridicoFilters
                  filters={{ status, number }}
                  sortDir={sortDir}
                />
                <Divider />
                <Box sx={{ overflowX: "auto" }}>
                  <ProcessListTable rows={paginatedCustomers}  onOpenDrawer={handleOpenDrawer}/>
                </Box>
                <Divider />
                <JuridicoPagination
                  count={filteredCustomers.length}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </Card>
            </JuridicoSelectionProvider>
          </Stack>
        </Container>
      </Box>
      <MovimentsDrawer
        onClose={handleDrawerClose}
        open={drawerProcess !== null}
        number={drawerProcess?.number}
        tribunal={drawerProcess?.tribunal}
      />
    </>
  );
}

function applyFilters(
  rows: IProcess[],
  { status, number }: { status?: string; number?: string },
): IProcess[] {
  return rows.filter((row) => {
    const dataStatus = row?.status;
    const dataNumber = row?.number;

    if (status && dataStatus?.toLowerCase() !== status.toLowerCase()) {
      return false;
    }

    if (number && !dataNumber?.toLowerCase().includes(number.toLowerCase())) {
      return false;
    }

    return true;
  });
}

function applyPagination(
  rows: IProcess[],
  page: number,
  rowsPerPage: number,
): IProcess[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
