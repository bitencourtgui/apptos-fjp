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
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { PrivatePerson } from "../PrivatePerson";
import { FormikProps } from "formik";
import { PrivatePersonProps } from "@/types/privatePerson";

interface PartnersModalProps {
  formik: FormikProps<PrivatePersonProps>;
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
          <CloseOutlinedIcon />
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
          <PrivatePerson {...formik} pocket={true} />
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", px: 3 }}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            onClick={() => console.log(false)}
          >
            Cadastrar
          </Button>
        </CardActions>
      </form>
    </Drawer>
  );
};

export default PartnersModal;
