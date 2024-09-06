"use client";

import Settings04Icon from "@untitled-ui/icons-react/build/esm/Settings04";
import { Box, Button, Stack, SvgIcon, Typography } from "@mui/material";
import Image from "next/image";

export const Novidades = () => {
  return (
    <Stack
      alignItems="center"
      direction={{
        xs: "column",
        md: "row",
      }}
      spacing={4}
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "primary.darkest" : "neutral.300",
        borderRadius: 2.5,
        p: 4,
      }}
    >
      <Box
        sx={{
          width: 200,
        }}
      >
        <Image
          src="/assets/illustrations/pessoa-sentada.png"
          alt="Imagem de uma pessoa sentada com notebook"
          width={118}
          height={149}
        />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography color="text.primary" variant="h6" sx={{ mt: 2 }}>
          Nova atualização disponível!
        </Typography>
        <Typography color="text.primary" sx={{ mt: 1 }} variant="body1">
          Agora, você pode gerenciar sua conta com facilidade na nova página de
          configurações. Tudo isso com uma navegação mais intuitiva e segura!
        </Typography>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Button
            color="primary"
            href="/minha-conta"
            startIcon={
              <SvgIcon>
                <Settings04Icon />
              </SvgIcon>
            }
            variant="contained"
          >
            Abrir configuração
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};
