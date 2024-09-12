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
import { FormikProps } from "formik";
import { FormBusiness } from "./form/business/business";
// import { LegalPerson } from ".";
// import { ILegalPerson } from "@/types/legalPerson";

interface PartnersModalProps {
  formik: any //FormikProps<ILegalPerson>;
  open: boolean;
  handleToggle: () => void;
}

const BusinessModal = ({ formik, open, handleToggle }: PartnersModalProps) => {
  return (
    <Drawer open={open} anchor="right" onClose={() => handleToggle()}>
      <DialogTitle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography>Cadastro de empresa</Typography>
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
          <FormBusiness {...formik} />
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", px: 3 }}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            onClick={() => console.info(false)}
          >
            Cadastrar
          </Button>
        </CardActions>
      </form>
    </Drawer>
  );
};

export default BusinessModal;
