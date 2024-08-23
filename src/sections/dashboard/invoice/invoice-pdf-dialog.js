import { PDFViewer } from "@react-pdf/renderer";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import { Box, Button, Dialog, SvgIcon } from "@mui/material";
import { AberturaDeEmpresa } from "@/sections/contratos/tipos/abertura-empresa";

export const InvoicePdfDialog = (props) => {
  const { contract, onClose, open = false, ...other } = props;

  if (!contract) {
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
            <AberturaDeEmpresa contract={contract} />
          </PDFViewer>
        </Box>
      </Box>
    </Dialog>
  );
};

