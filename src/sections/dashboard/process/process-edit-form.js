/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from "react";
import { FormProcessInitial } from "./process-initial";
import NextLink from "next/link";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Unstable_Grid2 as Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { useRouter as useNextRouter } from "next/router";
import { processSchema } from "./process-schema";
import { maskProcess } from "../../../utils/masks/mask-process";
import ProcessApi from "../../../api/process";
import { useAuth } from "../../../hooks/use-auth";
import { useMounted } from "../../../hooks/use-mounted";

const useProcess = (id) => {
  const isMounted = useMounted();
  const [process, setProcess] = useState(null);

  const getFinancial = useCallback(async () => {
    try {
      const response = await ProcessApi.getProcess(id);

      if (isMounted()) {
        setProcess(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getFinancial();
  }, [id]);

  return process;
};

export const ProcessEditForm = (props) => {
  const { customerId, ...other } = props;

  const process = useProcess(customerId);
  const router = useRouter();
  const nextRouter = useNextRouter();

  const processId = nextRouter.query.id ?? "";

  const { getTenant } = useAuth();
  const gt = getTenant();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: process || FormProcessInitial,
    validationSchema: processSchema,
    onSubmit: async (values, helpers) => {
      try {
        const response = await ProcessApi.updateProcess(processId, values);

        if (response.status === 200) {
          toast.success("Cliente cadastrado");
          helpers.setStatus({ success: true });
          helpers.setSubmitting(false);
          router.push(`/${gt}/clientes/${values.customerId}`);
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
    <form onSubmit={formik.handleSubmit} {...other}>
      <Card>
        <CardHeader title="Dados do processo" />
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="status">Status</InputLabel>
                <Select
                  labelId="status"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={!!(formik.touched.status && formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                >
                  <MenuItem value="archived">Arquivado</MenuItem>
                  <MenuItem value="progress">Andamento</MenuItem>
                  <MenuItem value="suspended">Suspenso</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={!!(formik.touched.number && formik.errors.number)}
                fullWidth
                helperText={formik.touched.number && formik.errors.number}
                label="Número do Processo"
                name="number"
                onBlur={formik.handleBlur}
                onChange={maskProcess(formik.handleChange)}
                required
                value={formik.values.number}
                inputProps={{
                  maxLength: 20,
                }}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={!!(formik.touched.class && formik.errors.class)}
                fullWidth
                helperText={formik.touched.class && formik.errors.class}
                label="Classe"
                name="class"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.class}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={!!(formik.touched.subject && formik.errors.subject)}
                fullWidth
                helperText={formik.touched.subject && formik.errors.subject}
                label="Assunto"
                name="subject"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.subject}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={!!(formik.touched.court && formik.errors.court)}
                fullWidth
                helperText={formik.touched.court && formik.errors.court}
                label="Foro"
                name="court"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.court}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={!!(formik.touched.division && formik.errors.division)}
                fullWidth
                helperText={formik.touched.division && formik.errors.division}
                label="Vara"
                name="division"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.division}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={
                  !!(
                    formik.touched.divisionPhone && formik.errors.divisionPhone
                  )
                }
                fullWidth
                helperText={
                  formik.touched.divisionPhone && formik.errors.divisionPhone
                }
                label="Telefone Vara"
                name="divisionPhone"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.divisionPhone}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={
                  !!(
                    formik.touched.divisionEmail && formik.errors.divisionEmail
                  )
                }
                fullWidth
                helperText={
                  formik.touched.divisionEmail && formik.errors.divisionEmail
                }
                label="E-mail Vara"
                name="divisionEmail"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.divisionEmail}
              />
            </Grid>
          </Grid>
        </CardContent>

        <CardHeader title="Partes do processo" />
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.exeqte && formik.errors.exeqte)}
                fullWidth
                helperText={formik.touched.exeqte && formik.errors.exeqte}
                label="Autor"
                name="exeqte"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.exeqte}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.exectdo && formik.errors.exectdo)}
                fullWidth
                helperText={formik.touched.exectdo && formik.errors.exectdo}
                label="Réu"
                name="exectdo"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.exectdo}
              />
            </Grid>
          </Grid>
        </CardContent>

        <CardHeader title="Detalhes do processo" />
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={12}>
              <TextField
                error={!!(formik.touched.extra && formik.errors.extra)}
                fullWidth
                helperText={formik.touched.extra && formik.errors.extra}
                label="Observações"
                name="extra"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.extra}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          flexWrap="wrap"
          spacing={3}
          sx={{ p: 3 }}
        >
          <Button
            disabled={formik.isSubmitting}
            type="submit"
            variant="contained"
          >
            Atualizar
          </Button>
          <Button
            color="inherit"
            component={NextLink}
            disabled={formik.isSubmitting}
            href={`/${gt}/clientes`}
          >
            Cancelar
          </Button>
        </Stack>
      </Card>
    </form>
  );
};
