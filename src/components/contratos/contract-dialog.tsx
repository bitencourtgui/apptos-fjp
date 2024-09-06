"use client";

import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import { Box, Button, Dialog, SvgIcon } from "@mui/material";
import { PDFViewer } from "@react-pdf/renderer";
import { ContractTypes } from "./tipos";

export const ContractDialog = ({
  id,
  onClose,
  open = false,
  ...other
}: any) => {
  if (!id) {
    return null;
  }

  return (
    <Dialog fullScreen open={open} {...other}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: "background.paper",
            p: 2,
          }}
        >
          <Button
            color="inherit"
            startIcon={
              <SvgIcon>
                <ArrowLeftIcon />
              </SvgIcon>
            }
            onClick={onClose}
          >
            Fechar
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <PDFViewer height="100%" style={{ border: "none" }} width="100%">
            <ContractTypes id={id} />
          </PDFViewer>
        </Box>
      </Box>
    </Dialog>
  );
};
