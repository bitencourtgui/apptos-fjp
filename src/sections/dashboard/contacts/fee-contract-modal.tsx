import React, { FC, useState, useCallback } from "react";
import {
  Button,
  CardActions,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useFormik } from "formik";
import { FeeContractInitial } from "./fee-contract-initial";
import CustomersApi from "../../../api/customers";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { feeSchema } from "./fee-contract-schema";

interface FeeContractModalProps {
  open: boolean;
  handleToggle: (open: boolean) => void;
  source: any; // Adjust the type as per your source data structure
}

const FeeContractModal: FC<FeeContractModalProps> = ({
  open,
  handleToggle,
  source,
}) => {
  const router = useRouter();

  const initialValues = source || FeeContractInitial;
  const [frequency, setFrequency] = useState("monthly");

  const handleStatusChange = useCallback((event) => {
    setFrequency(event.target.checked ? "indetermined" : "monthly");
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: feeSchema,
    onSubmit: async (values, helpers) => {
      try {
        values.frequency = frequency;

        const response = await CustomersApi.updateCustomer(values.id, values);

        if (response.status === 200) {
          toast.success("Cliente cadastrado");
          helpers.setStatus({ success: true });
          helpers.setSubmitting(false);
          window.open(
            `/contracts/feeContract/${values.id}?frequency=${frequency}`,
            "_blank"
          );
          router.reload();
        }
      } catch (err) {
        toast.error("Falha ao cadastrar cliente");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <Dialog
      open={open}
      onClose={() => handleToggle(false)}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth={"sm"}
      fullWidth={true}
    >
      <DialogTitle
        id="scroll-dialog-title"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography>Contrato de honorários</Typography>
        <IconButton
          aria-label="delete"
          onClick={() => handleToggle(false)}
          sx={{ padding: "0" }}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <form onSubmit={formik.handleSubmit}>
          <CardContent sx={{ pt: 0, pb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={frequency === "indetermined"}
                      onChange={handleStatusChange}
                    />
                  }
                  label={frequency === "monthly" ? "Mensal" : "Indeterminado"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="DO OBJETO"
                  name="object"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required
                  multiline
                  rows={4}
                  value={formik.values.object}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained">
              Gerar
            </Button>
          </CardActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeeContractModal;
