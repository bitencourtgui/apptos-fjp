import NextLink from "next/link";
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { usePageView } from "@/hooks/use-page-view";
import { Layout as DashboardLayout } from "@/layouts/dashboard";
import { ProcessAddForm } from "@/sections/dashboard/process/process-add-form";
import { BreadcrumbsSeparator } from "@/components/breadcrumbs-separator";
import { useAuth } from "@/hooks/use-auth";
import { capitalize } from "@/utils/capitalize";
import { Head } from "@/components/Head";

const AdicionarProcessos = () => {
  const router = useRouter();

  const { customerId } = router.query;

  const { getTenant } = useAuth();
  const gt = getTenant();
  usePageView();

  return (
    <>
      <Head page="Adicionar Processo" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Stack spacing={4}>
              <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={`/${gt}`}
                  variant="subtitle2"
                >
                  {capitalize(gt)}
                </Link>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={`/${gt}/processos`}
                  variant="subtitle2"
                >
                  Processos
                </Link>
                <Typography color="text.secondary" variant="subtitle2">
                  Adicionar processo
                </Typography>
              </Breadcrumbs>
            </Stack>
            <ProcessAddForm customerId={customerId} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

AdicionarProcessos.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default AdicionarProcessos;
