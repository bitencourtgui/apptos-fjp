/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { usePageView } from "../../hooks/use-page-view";
import { useSettings } from "../../hooks/use-settings";
import { Layout as DashboardLayout } from "../../layouts/dashboard";
import { OverviewBanner } from "../../sections/dashboard/overview/overview-banner";
import { OverviewDoneTasks } from "../../sections/dashboard/overview/overview-done-tasks";
import { OverviewPendingIssues } from "../../sections/dashboard/overview/overview-pending-issues";
import { OverviewHelp } from "../../sections/dashboard/overview/overview-help";
import { OverviewOpenTickets } from "../../sections/dashboard/overview/overview-open-tickets";

import { Head } from "@/components/Head";

import { useMounted } from "../../hooks/use-mounted";
import ProcessApi from "../../api/process";
import { useCustomer } from "@/hooks/useCustomer";

const useProcess = () => {
  const isMounted = useMounted();
  const [state, setState] = useState(0);

  const getProcess = useCallback(async () => {
    try {
      const response = await ProcessApi.getTotalCount();

      if (isMounted()) {
        setState(response.count);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getProcess();
  }, []);

  return state;
};

const Page = () => {
  const settings = useSettings();
  const customer = useCustomer();
  const process = useProcess();
  usePageView();

  return (
    <>
      <Head page="Visão Geral" />

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
            disableEqualOverflow
            spacing={{
              xs: 3,
              lg: 4,
            }}
          >
            <Grid xs={12}>
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <div>
                  <Typography variant="h4">Olá, Seja bem-vindo</Typography>
                </div>
              </Stack>
            </Grid>
            <Grid xs={12} md={4}>
              <OverviewDoneTasks amount={customer} />
            </Grid>
            <Grid xs={12} md={4}>
              <OverviewPendingIssues amount={process} />
            </Grid>
            <Grid xs={12} md={4}>
              <OverviewOpenTickets amount={5} />
            </Grid>
            <Grid xs={12} md={7}>
              <OverviewBanner />
            </Grid>
            <Grid xs={12} md={5}>
              <OverviewHelp />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
