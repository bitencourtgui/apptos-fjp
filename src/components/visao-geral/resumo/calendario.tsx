"use client";

import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import {
  Box,
  Button,
  Card,
  CardActions,
  Divider,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import Image from "next/image";

export const ResumoCalendario = () => {
  return (
    <Card>
      <Stack
        alignItems="center"
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={3}
        sx={{
          px: 4,
          py: 3,
        }}
      >
        <div>
          <Image
            src="/assets/icons/resumo-calendario.svg"
            width={48}
            height={48}
            alt="icone resumo calendario"
          />
        </div>
        <Box sx={{ flexGrow: 1 }}>
          <Typography color="text.secondary" variant="body2">
            Reuniões (EM BREVE)
          </Typography>
          <Typography color="text.primary" variant="h4">
            {0}
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <CardActions>
        <Button
          color="inherit"
          href="/visao-geral"
          endIcon={
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
        >
          Veja as próximas reuniões
        </Button>
      </CardActions>
    </Card>
  );
};
