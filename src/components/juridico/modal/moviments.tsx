/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import RefreshCcw01Icon from "@untitled-ui/icons-react/build/esm/RefreshCcw01";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
import {
  Badge,
  badgeClasses,
  Drawer,
  IconButton,
  ListItem,
  ListItemText,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { PropertyList } from "@/components/core/property-list";

// Tipos
interface Moviment {
  dataHora: string;
  nome: string;
  complementosTabelados?: { nome: string }[];
}

interface ProcessData {
  movimentos: Moviment[];
}

interface MovimentsDrawerProps {
  onClose: () => void;
  onReset?: () => void;
  open: boolean;
  number?: string;
  tribunal?: string;
}

interface FetchResult {
  data: ProcessData | null;
  status: number;
}

export const unmaskProcess = (processNumber: string): string => {
  return processNumber.replace(/\D/g, "");
};

export const MovimentsDrawer: React.FC<MovimentsDrawerProps> = (props) => {
  const { onClose, onReset, open, number, tribunal, ...other } = props;

  const [processData, setData] = useState<FetchResult | null>(null);

  const fetchData = async (number: string): Promise<FetchResult> => {
    const response = await fetch("/api/cnj/consulta-processo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        numeroProcesso: unmaskProcess(number),
        tribunal: tribunal?.toLowerCase() ?? "tjsp",
      }),
    });

    const data = await response.json();

    return data?.hits?.hits?.length > 0
      ? { data: data?.hits?.hits[0]?._source, status: response.status }
      : { data: null, status: response.status };
  };

  useEffect(() => {
    if (open && number) {
      fetchData(number).then((result) => setData(result));
    }
  }, [open, number, tribunal]);

  return (
    <Drawer
      disableScrollLock
      anchor="right"
      onClose={onClose}
      open={open}
      ModalProps={{
        BackdropProps: {
          invisible: true,
        },
        sx: { zIndex: 1400 },
      }}
      PaperProps={{
        elevation: 24,
        sx: {
          maxWidth: "100%",
          width: 440,
        },
      }}
      {...other}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={3}
        sx={{
          px: 3,
          pt: 2,
        }}
      >
        <Typography variant="h6">Movimentos</Typography>
        <Stack alignItems="center" direction="row" spacing={0.5}>
          <IconButton color="inherit" onClick={onClose}>
            <SvgIcon>
              <XIcon />
            </SvgIcon>
          </IconButton>
        </Stack>
      </Stack>
      <Stack sx={{ p: 3 }}>
        {processData && processData.data && processData.data.movimentos
          ? processData.data.movimentos.length > 0
            ? processData.data.movimentos
                .slice()
                .reverse()
                .map((item, index) => {
                  const complement =
                    item.complementosTabelados && item.complementosTabelados[0];

                  return (
                    <PropertyList key={index}>
                      <ListItem divider>
                        <ListItemText
                          primary={`${format(
                            parseISO(item.dataHora),
                            "dd/MM/yyyy",
                          )} - ${item.nome}`}
                          secondary={complement?.nome ?? ""}
                        />
                      </ListItem>
                    </PropertyList>
                  );
                })
            : "Não há itens a serem listados"
          : "Carregando..."}
      </Stack>
    </Drawer>
  );
};
