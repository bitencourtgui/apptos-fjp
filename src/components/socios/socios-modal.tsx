import {
  Button,
  CardActions,
  CardContent,
  DialogTitle,
  IconButton,
  Drawer,
  Typography,
  Divider,
} from "@mui/material";
import XClose from "@untitled-ui/icons-react/build/esm/XClose";
import { FormPerson } from "../clientes/form/personal/personal";

interface PartnersModalProps {
  formik: any;
  open: boolean;
  handleToggle: () => void;
}

const PartnersModal = ({ formik, open, handleToggle }: PartnersModalProps) => {
  return (
    <Drawer open={open} anchor="right" onClose={() => handleToggle()}>
      <DialogTitle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography>Cadastro de sócio</Typography>
        <IconButton onClick={() => handleToggle()} sx={{ p: 0 }}>
          <XClose />
        </IconButton>
      </DialogTitle>
      <Divider />

      <form onSubmit={formik.handleSubmit}>
        <CardContent
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            width: "380px",
            gap: "8px",
          }}
        >
          <FormPerson {...formik} pocket={true} />
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", px: 3 }}>
          <Button fullWidth type="submit" variant="contained">
            Cadastrar
          </Button>
        </CardActions>
      </form>
    </Drawer>
  );
};

export default PartnersModal;
