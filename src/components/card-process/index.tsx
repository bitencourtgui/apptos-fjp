import React from "react";
import Card from "@mui/material/Card";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { Scrollbar } from "../scrollbar";
import { maskProcess } from "../../utils/masks/mask-process";
import { phoneMask } from "../../utils/masks/phoneMask";
import { useAuth } from "../../hooks/use-auth";
import ProcessApi from "../../api/process";
import toast from "react-hot-toast";

export const CardProcess = ({
  customerName,
  status,
  number,
  exeqte,
  exectdo,
  subject,
  division,
  distribution,
  divisionPhone,
  extra,
  divisionEmail,
  judge,
  others,
  area,
  control,
  price,
  court,
  ...props
}: any) => {
  let color;

  if (status === "archived") {
    color = "#1119271f";
  } else if (status === "progress") {
    color = "#84dcc6";
  } else if (status === "suspended") {
    color = "#ffa726";
  }

  const router = useRouter();
  const { getTenant } = useAuth();
  const gt = getTenant();

  const handleSubmit = async (id: string) => {
    try {
      const response = await ProcessApi.deleteProcess(id);

      if (response.status === 200) {
        toast.success("Cliente cadastrado");
        router.reload();
      }
    } catch (err) {
      toast.error("Falha ao cadastrar cliente");
    }
  };

  const opposing = exeqte.includes(customerName)
    ? exectdo
    : exectdo.includes(customerName)
    ? exeqte
    : exectdo;

  return (
    <Card key={number} sx={{ margin: "16px 0" }}>
      <Scrollbar>
        <Box>
          <Accordion sx={{ borderLeft: `${color} 15px solid` }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid display="flex" gap={8} m={2}>
                <Box display="flex" flexDirection="column" alignItems="left">
                  <Typography variant="caption">Processo</Typography>
                  <Typography variant="h6" sx={{ minWidth: "265px" }}>
                    {maskProcess(number)}
                  </Typography>
                </Box>
                <Divider orientation="vertical" />
                <Box display="flex" flexDirection="column" alignItems="left">
                  <Typography variant="caption">Parte Contrária</Typography>
                  <Typography variant="h6">{opposing}</Typography>
                </Box>
                <Divider orientation="vertical" />
                <Box display="flex" flexDirection="column" alignItems="left">
                  <Typography variant="caption">Assunto</Typography>
                  <Typography variant="h6">{subject}</Typography>
                </Box>
              </Grid>
            </AccordionSummary>

            <Stack direction="column" mx={4} my={3} gap={2.2}>
              <Stack direction="row" gap={10}>
                <div>
                  <Stack direction="row">
                    <Typography variant="body2">Processo</Typography>
                  </Stack>
                  <Typography variant="subtitle2">
                    {maskProcess(number)}
                  </Typography>
                </div>
                <div>
                  <Stack direction="row">
                    <Typography variant="body2">Classe</Typography>
                  </Stack>
                  <Typography variant="subtitle2">
                    {subject !== "" ? subject : "--"}
                  </Typography>
                </div>
                <div>
                  <Stack direction="row">
                    <Typography variant="body2">Assunto</Typography>
                  </Stack>
                  <Typography variant="subtitle2">
                    {props.class !== "" ? props.class : "--"}
                  </Typography>
                </div>
              </Stack>
              <Divider />
              <Stack direction="row" gap={10}>
                <div>
                  <Stack direction="row">
                    <Typography variant="body2">Autor</Typography>
                  </Stack>
                  <Typography variant="subtitle2">
                    {exeqte !== "" ? exeqte : "--"}
                  </Typography>
                </div>
                <div>
                  <Stack direction="row">
                    <Typography variant="body2">Réu</Typography>
                  </Stack>
                  <Typography variant="subtitle2">
                    {exectdo !== "" ? exectdo : "--"}
                  </Typography>
                </div>
              </Stack>
              <Divider />
              <Stack direction="row" gap={10}>
                <div>
                  <Stack direction="row">
                    <Typography variant="body2">Foro</Typography>
                  </Stack>
                  <Typography variant="subtitle2">
                    {court !== "" ? court : "--"}
                  </Typography>
                </div>
                <div>
                  <Stack direction="row">
                    <Typography variant="body2">Vara</Typography>
                  </Stack>
                  <Typography variant="subtitle2">
                    {division !== "" ? division : "--"}
                  </Typography>
                </div>

                <div>
                  <Stack direction="row">
                    <Typography variant="body2">E-mail da Vara</Typography>
                  </Stack>
                  <Typography variant="subtitle2">
                    {divisionEmail !== "" ? divisionEmail : "--"}
                  </Typography>
                </div>
                <div>
                  <Stack direction="row">
                    <Typography variant="body2">Telefone da Vara</Typography>
                  </Stack>
                  <Typography variant="subtitle2">
                    {divisionPhone !== "" ? phoneMask(divisionPhone) : "--"}
                  </Typography>
                </div>
              </Stack>
              <Divider />
              <Stack direction="row" gap={10}>
                <div>
                  <Stack direction="row">
                    <Typography variant="body2">Observações</Typography>
                  </Stack>
                  <Typography variant="subtitle2">
                    {extra !== "" ? extra : "--"}
                  </Typography>
                </div>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                gap={2}
                mt={3}
              >
                <Button
                  variant="contained"
                  onClick={() =>
                    router.push(`/${gt}/processos/${props.id}/editar`)
                  }
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleSubmit(props.id)}
                >
                  Excluir
                </Button>
              </Stack>
            </Stack>
          </Accordion>
        </Box>
      </Scrollbar>
    </Card>
  );
};
