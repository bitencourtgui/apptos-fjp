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
          EM BREVE
        </Grid>
      </Container>
    </Box>
  );
}
