"use client";

import { Breadcrumbs } from "@/components/core/breadcrumbs";
import {
  CustomersFilters,
  Filters,
} from "@/components/customer/customers-filters";
import { CustomersPagination } from "@/components/customer/customers-pagination";
import { CustomersSelectionProvider } from "@/components/customer/customers-selection-context";
import {
  Customer,
  CustomersTable,
} from "@/components/customer/customers-table";
import { useCustomers } from "@/hooks/use-customers";
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
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";

interface PageProps {
  searchParams: {
    email?: string;
    name?: string;
    sortDir?: "asc" | "desc";
    document?: string;
  };
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
  const { email, name, sortDir, document } = searchParams;

  const { customers } = useCustomers();

  const filteredCustomers = applyFilters(customers, { email, name, document });
  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
        <Container maxWidth={false}>
          <Stack spacing={4}>
            <Breadcrumbs />
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Typography variant="h4">Clientes</Typography>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  href="/clientes/adicionar"
                  size="small"
                  variant="contained"
                  startIcon={
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  }
                >
                  Adicionar
                </Button>
              </Stack>
            </Stack>
            <CustomersSelectionProvider customers={filteredCustomers}>
              <Card>
                <CustomersFilters
                  filters={{ email, name, document }}
                  sortDir={sortDir}
                />
                <Divider />
                <Box sx={{ overflowX: "auto" }}>
                  <CustomersTable rows={filteredCustomers} />
                </Box>
                <Divider />
                <CustomersPagination
                  count={filteredCustomers.length}
                  page={0}
                />
              </Card>
            </CustomersSelectionProvider>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

function applyFilters(
  rows: Customer[],
  { email, name, document }: Filters,
): Customer[] {
  return rows.filter((row) => {
    const isBusiness = row?.business?.corporateName !== "";
    const dataEmail = isBusiness ? row?.business?.email : row?.email;
    const dataName = isBusiness ? row?.business?.corporateName : row?.name;
    const dataDocument = isBusiness ? row?.business?.document : row?.document;

    if (email) {
      if (!dataEmail?.toLowerCase().includes(email.toLowerCase())) {
        return false;
      }
    }

    if (name) {
      if (!dataName?.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }
    }

    if (document) {
      if (!dataDocument?.toLowerCase().includes(document.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}
