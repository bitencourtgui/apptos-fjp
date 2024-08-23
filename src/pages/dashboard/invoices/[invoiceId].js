import { useCallback, useEffect, useState } from "react";
import NextLink from "next/link";
import Head from "next/head";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useMounted } from "../../../hooks/use-mounted";
import { usePageView } from "../../../hooks/use-page-view";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import { paths } from "../../../paths";
import { InvoicePdfDialog } from "../../../sections/dashboard/invoice/invoice-pdf-dialog";
import { InvoicePdfDocument } from "../../../sections/dashboard/invoice/invoice-pdf-document";
import { InvoicePreview } from "../../../sections/dashboard/invoice/invoice-preview";
import { getInitials } from "../../../utils/get-initials";
import CustomersApi from "@/api/customers";

const useCustomer = (userId) => {
  const isMounted = useMounted();

  const [customer, setCustomer] = useState(null);

  const getCustomer = useCallback(async () => {
    try {
      const response = await CustomersApi.getCustomer(userId.toString());

      if (isMounted()) {
        setCustomer(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getCustomer();
  }, []);

  return customer;
};

const Page = () => {
  const invoice = useCustomer("211c32bd-d7a1-4658-8c69-e382cd12c8bb");
  const [openPdf, setOpenPdf] = useState(false);

  usePageView();

  if (!invoice) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Contrato</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack divider={<Divider />} spacing={4}>
            <Stack spacing={4}>
              <div>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={paths.dashboard.invoices.index}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <SvgIcon sx={{ mr: 1 }}>
                    <ArrowLeftIcon />
                  </SvgIcon>
                  <Typography variant="subtitle2">Invoices</Typography>
                </Link>
              </div>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Avatar
                    sx={{
                      height: 42,
                      width: 42,
                    }}
                  >
                    {getInitials("guilherme bitencourt")}
                  </Avatar>
                  <div>
                    <Typography variant="h4">{123}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {"invoice.customer.name"}
                    </Typography>
                  </div>
                </Stack>
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Button color="inherit" onClick={() => setOpenPdf(true)}>
                    Preview
                  </Button>
                  <PDFDownloadLink
                    document={<InvoicePdfDocument invoice={invoice} />}
                    fileName="invoice"
                    style={{ textDecoration: "none" }}
                  >
                    <Button color="primary" variant="contained">
                      Download
                    </Button>
                  </PDFDownloadLink>
                </Stack>
              </Stack>
            </Stack>
            <InvoicePreview invoice={invoice} />
          </Stack>
        </Container>
      </Box>
      <InvoicePdfDialog
        invoice={invoice}
        onClose={() => setOpenPdf(false)}
        open={openPdf}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
