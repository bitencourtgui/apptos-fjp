import Head from "next/head";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { usePageView } from "../../../hooks/use-page-view";
import { useSettings } from "../../../hooks/use-settings";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import { LogisticsDeviatedVehicles } from "../../../sections/dashboard/logistics/logistics-deviated-vehicles";
import { LogisticsErrorVehicles } from "../../../sections/dashboard/logistics/logistics-error-vehicles";
import { LogisticsLateVehicles } from "../../../sections/dashboard/logistics/logistics-late-vehicles";
import { LogisticsRouteVehicles } from "../../../sections/dashboard/logistics/logistics-route-vehicles";
import { LogisticsVehiclesCondition } from "../../../sections/dashboard/logistics/logistics-vehicles-condition";
import { LogisticsVehiclesList } from "../../../sections/dashboard/logistics/logistics-vehicles-list";
import { LogisticsVehiclesOverview } from "../../../sections/dashboard/logistics/logistics-vehicles-overview";

const Participants = {
  data: [
    {
      created_at: "2023-10-31T16:53:05.119Z",
      customer: {
        email: "mycustomer@mail.com",
        id: "29eb9963-8f4f-4c03-9897-63bdba0d5eb2",
        name: "my customer",
      },
      id: "5cbb3832-7b5f-4cf2-b04e-ca6a4289d896",
      net_amount: 0,
      payment_method: "boleto",
      product: {
        id: "aaa86f40-d7ae-11ed-acc6-e1c45591a30e",
        name: "my product",
      },
      reference: "9dAQA5a",
      status: "paid",
      type: "product",
      updated_at: "2023-10-31T16:57:01.810Z",
    },
  ],
  pagination: {
    count: 10,
    page_number: 1,
    page_size: 10,
  },
};

const Page = () => {
  const settings = useSettings();

  usePageView();

  return (
    <>
      <Head>
        <title>Dashboard: Logistics Dashboard | Devias Kit PRO</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : "xl"}>
          <Grid
            container
            spacing={{
              xs: 3,
              lg: 4,
            }}
          >
            <Grid xs={12}>
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <div>
                  <Typography variant="h4">Logistics</Typography>
                </div>
                <div>
                  <Stack direction="row" spacing={4}>
                    <Button
                      startIcon={
                        <SvgIcon>
                          <PlusIcon />
                        </SvgIcon>
                      }
                      variant="contained"
                    >
                      Add Vehicle
                    </Button>
                  </Stack>
                </div>
              </Stack>
            </Grid>
            <Grid xs={12} md={3}>
              <LogisticsRouteVehicles amount={38} />
            </Grid>
            <Grid xs={12} md={3}>
              <LogisticsErrorVehicles amount={2} />
            </Grid>
            <Grid xs={12} md={3}>
              <LogisticsDeviatedVehicles amount={1} />
            </Grid>
            <Grid xs={12} md={3}>
              <LogisticsLateVehicles amount={2} />
            </Grid>
            <Grid xs={12} lg={6}>
              <LogisticsVehiclesOverview
                chartSeries={[38, 50, 12]}
                labels={["Available", "Out of service", "On route"]}
              />
            </Grid>
            <Grid xs={12} lg={6}>
              <LogisticsVehiclesCondition bad={12} excellent={181} good={24} />
            </Grid>
            <Grid xs={12}>
              <LogisticsVehiclesList
                vehicles={Participants.data}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
