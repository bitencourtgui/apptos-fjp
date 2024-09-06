import React from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { ResumoClientes } from "@/components/visao-geral/resumo/clientes";
import { ResumoJuridico } from "@/components/visao-geral/resumo/juridico";
import { ResumoCalendario } from "@/components/visao-geral/resumo/calendario";
import { Novidades } from "@/components/visao-geral/novidades/novidades";
import { Suporte } from "@/components/visao-geral/suporte/suporte";

export default function Page(): React.JSX.Element {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
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
            <ResumoClientes />
          </Grid>
          <Grid xs={12} md={4}>
            <ResumoJuridico />
          </Grid>
          <Grid xs={12} md={4}>
            <ResumoCalendario />
          </Grid>
          <Grid xs={12} md={7}>
            <Novidades />
          </Grid>
          <Grid xs={12} md={5}>
            <Suporte />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
