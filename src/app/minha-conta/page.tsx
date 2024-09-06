"use client";

import {
  Box,
  Container,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { ConfiguracoesSeguranca } from "@/components/minha-conta/configuracoes-seguranca";
import { ConfiguracoesGerais } from "@/components/minha-conta/configuracoes-gerais";

const tabs = [
  { label: "Geral", value: "general" },
  { label: "Segurança", value: "security" },
];

export default function Page(): React.JSX.Element {
  const [currentTab, setCurrentTab] = useState("general");
  const handleTabsChange = useCallback((event: any, value: any) => {
    setCurrentTab(value);
  }, []);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3} sx={{ mb: 3 }}>
          <Typography variant="h4">Minha conta</Typography>
          <div>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
            <Divider />
          </div>
        </Stack>
        {currentTab === "general" && <ConfiguracoesGerais />}
        {currentTab === "security" && <ConfiguracoesSeguranca />}
      </Container>
    </Box>
  );
}
