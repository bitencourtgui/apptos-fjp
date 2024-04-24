/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect, useCallback } from "react";
import {
  Button,
  CardActions,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  Autocomplete,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useFormik } from "formik";

import { POAInitial } from "./power-of-attorney-initial";
import { useMounted } from "../../../hooks/use-mounted";
import LawyersApi from "../../../api/lawyers";
import toast from "react-hot-toast";
import CustomersApi from "../../../api/customers";
import { useRouter } from "next/router";

const useLawyers = () => {
  const isMounted = useMounted();

  const [lawyers, setLawyers] = useState(null);

  const getCustomer = useCallback(async () => {
    try {
      const response = await LawyersApi.getLawyers();

      if (isMounted()) {
        setLawyers(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getCustomer();
  }, []);

  return lawyers;
};

const PowerOfAttorneyModal = ({ open, handleToggle, source }) => {
  const router = useRouter();
  const [isMinor, setIsMinor] = useState(false);

  const lawyers = useLawyers();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: source || POAInitial,
    onSubmit: async (values, helpers) => {
      if (isMinor) {
        values.underage = {
          name: values.MinorName,
          document: values.MinorDocument,
          registration: values.MinorRegistration,
          gender: values.MinorGender,
        };

        delete values.MinorName;
        delete values.MinorDocument;
        delete values.MinorRegistration;
        delete values.MinorGender;
      }

      try {
        const response = await CustomersApi.updateCustomer(values.id, values);
        const oabNumbers = values.laywers.map((lawyer) => lawyer.OAB);
        if (response.status === 200) {
          toast.success("Cliente cadastrado");
          helpers.setStatus({ success: true });
          helpers.setSubmitting(false);
          window.open(
            `/contracts/powerOfAttorney/${values.id}?oab=[${oabNumbers}]&isMinor=${isMinor}`,
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
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle
        id="scroll-dialog-title"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography>Procuração</Typography>
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
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  Representação de menor?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="minor-radio-buttons-group-label"
                  name="isMinor"
                  value={isMinor}
                  defaultValue={"false"}
                  onChange={(event) => {
                    const isMinor = event.target.value === "true";
                    setIsMinor(isMinor);
                  }}
                >
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="Não"
                  />
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Sim"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={lawyers}
                  getOptionLabel={(option) => option?.name}
                  filterSelectedOptions
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="Selecione os advogados" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Poderes"
                  name="powers"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required
                  value={formik.values.powers}
                  error={!!(formik.touched.powers && formik.errors.powers)}
                  helperText={formik.touched.powers && formik.errors.powers}
                />
              </Grid>
              {isMinor && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Dados do Menor</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nome do Menor"
                      name="MinorName"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      required
                      value={formik.values.MinorName}
                      error={
                        !!(formik.touched.MinorName && formik.errors.MinorName)
                      }
                      helperText={
                        formik.touched.MinorName && formik.errors.MinorName
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="CPF do Menor"
                      name="MinorDocument"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      required
                      value={formik.values.MinorDocument}
                      error={
                        !!(
                          formik.touched.MinorDocument &&
                          formik.errors.MinorDocument
                        )
                      }
                      helperText={
                        formik.touched.MinorDocument &&
                        formik.errors.MinorDocument
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="RG do Menor"
                      name="MinorRegistration"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      required
                      value={formik.values.MinorRegistration}
                      error={
                        !!(
                          formik.touched.MinorRegistration &&
                          formik.errors.MinorRegistration
                        )
                      }
                      helperText={
                        formik.touched.MinorRegistration &&
                        formik.errors.MinorRegistration
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="MinorGender">Gênero do Menor</InputLabel>
                      <Select
                        labelId="MinorGender"
                        id="MinorGender"
                        name="MinorGender"
                        label="Gênero"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.MinorGender}
                        error={
                          !!(
                            formik.touched.MinorGender &&
                            formik.errors.MinorGender
                          )
                        }
                        helperText={
                          formik.touched.MinorGender &&
                          formik.errors.MinorGender
                        }
                      >
                        <MenuItem value="female">Feminino</MenuItem>
                        <MenuItem value="male">Masculino</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
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

export default PowerOfAttorneyModal;
