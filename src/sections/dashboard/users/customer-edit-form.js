/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import NextLink from "next/link";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
  Unstable_Grid2 as Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CustomersApi from "../../../api/customers";
import Typography from "@mui/material/Typography";
import { customersInitial } from "./customer-initial";
import { customersSchema } from "./customer-schema";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/use-auth";

export const CustomerEditForm = (props) => {
  const { customer, ...other } = props;
  const router = useRouter();
  const { getTenant } = useAuth();
  const gt = getTenant();
  const [documentType, setDocumentType] = useState("cpf");

  const formik = useFormik({
    initialValues: customer || customersInitial,
    validationSchema: customersSchema,
    onSubmit: async (values, helpers) => {
      try {
        const response = await CustomersApi.updateCustomer(customer.id, values);

        if (response.status === 200) {
          toast.success("Cliente editado com sucesso");
          helpers.setStatus({ success: true });
          helpers.setSubmitting(false);
          router.push(`/${gt}/clientes/${customer.id}`);
        }
      } catch (err) {
        toast.error("Falha ao editar cliente");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (customer?.cpf?.length !== 1) {
      setDocumentType("cpf");
    } else {
      setDocumentType("cnpj");
    }
  }, [customer]);

  const handleDocument = async (e, formik) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "");

    formik.setFieldValue("document", numericValue);

    if (numericValue.length === 11) {
      setDocumentType("cpf");
      formik.setFieldValue("cpf", numericValue);
      formik.setFieldValue("cnpj", "");
    } else if (numericValue.length === 14) {
      setDocumentType("cnpj");
      formik.setFieldValue("cnpj", numericValue);
      formik.setFieldValue("cpf", "");

      try {
        const response = await CustomersApi.getBusinessCustomer(numericValue);

        formik.setFieldValue("corporateName", response.razao_social);
        formik.setFieldValue("cnae", response.cnae_fiscal);
        formik.setFieldValue("businessPostalCode", response.cep);
        formik.setFieldValue("businessStreet", response.logradouro);
        formik.setFieldValue("businessNumber", response.numero);
        formik.setFieldValue("businessComplement", response.complemento);
        formik.setFieldValue("businessNeighborhood", response.bairro);
        formik.setFieldValue("businessCity", response.municipio);
        formik.setFieldValue("businessState", response.uf);
      } catch (error) {
        // Handle errors
        console.error("Error fetching CNPJ information:", error);
      }
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} {...other}>
      <Card>
        <CardHeader title="Editar cliente" />
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={2}>
              <TextField
                error={!!(formik.touched.document && formik.errors.document)}
                fullWidth
                helperText={formik.touched.document && formik.errors.document}
                label="CPF / CNPJ"
                name="document"
                onChange={(e) => handleDocument(e, formik)}
                onBlur={formik.handleBlur}
                required
                value={formik.values.document}
              />
            </Grid>

            {documentType === "cnpj" ? (
              <>
                <Grid xs={12} md={8}>
                  <TextField
                    error={
                      !!(
                        formik.touched.corporateName &&
                        formik.errors.corporateName
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.corporateName &&
                      formik.errors.corporateName
                    }
                    label="Razão Social"
                    name="corporateName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.corporateName}
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    error={!!(formik.touched.cnae && formik.errors.cnae)}
                    fullWidth
                    helperText={formik.touched.cnae && formik.errors.cnae}
                    label="Cnae"
                    name="cnae"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.cnae}
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    error={
                      !!(
                        formik.touched.businessPostalCode &&
                        formik.errors.businessPostalCode
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.businessPostalCode &&
                      formik.errors.businessPostalCode
                    }
                    label="CEP"
                    name="businessPostalCode"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.businessPostalCode}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    error={
                      !!(
                        formik.touched.businessStreet &&
                        formik.errors.businessStreet
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.businessStreet &&
                      formik.errors.businessStreet
                    }
                    label="Rua"
                    name="businessStreet"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.businessStreet}
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    error={
                      !!(
                        formik.touched.businessNumber &&
                        formik.errors.businessNumber
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.businessNumber &&
                      formik.errors.businessNumber
                    }
                    label="Número"
                    name="businessNumber"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.businessNumber}
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    error={
                      !!(
                        formik.touched.businessComplement &&
                        formik.errors.businessComplement
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.businessComplement &&
                      formik.errors.businessComplement
                    }
                    label="Complemento"
                    name="businessComplement"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.businessComplement}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    error={
                      !!(
                        formik.touched.businessNeighborhood &&
                        formik.errors.businessNeighborhood
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.businessNeighborhood &&
                      formik.errors.businessNeighborhood
                    }
                    label="Bairro"
                    name="businessNeighborhood"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.businessNeighborhood}
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    error={
                      !!(
                        formik.touched.businessCity &&
                        formik.errors.businessCity
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.businessCity && formik.errors.businessCity
                    }
                    label="Cidade"
                    name="businessCity"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.businessCity}
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    error={
                      !!(
                        formik.touched.businessState &&
                        formik.errors.businessState
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.businessState &&
                      formik.errors.businessState
                    }
                    label="Estado"
                    name="businessState"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.businessState}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ margin: "24px 0 0 0" }}>
                    Responsável
                  </Typography>
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    error={!!(formik.touched.cpf && formik.errors.cpf)}
                    fullWidth
                    helperText={formik.touched.cpf && formik.errors.cpf}
                    label="CPF"
                    name="cpf"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.cpf}
                  />
                </Grid>
              </>
            ) : null}

            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Nome completo"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.name}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                error={
                  !!(formik.touched.nationality && formik.errors.nationality)
                }
                fullWidth
                helperText={
                  formik.touched.nationality && formik.errors.nationality
                }
                label="Nacionalidade"
                name="nationality"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.nationality}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel id="gender">Gênero</InputLabel>
                <Select
                  labelId="gender"
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  label="Gênero"
                  onChange={formik.handleChange}
                >
                  <MenuItem
                    defaultChecked={formik.values.gender === "female"}
                    value="female"
                  >
                    Feminino
                  </MenuItem>
                  <MenuItem
                    defaultChecked={formik.values.gender === "male"}
                    value="male"
                  >
                    Masculino
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={!!(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="E-mail"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={!!(formik.touched.rg && formik.errors.rg)}
                fullWidth
                helperText={formik.touched.rg && formik.errors.rg}
                label="RG"
                name="rg"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.rg}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={!!(formik.touched.phone && formik.errors.phone)}
                fullWidth
                helperText={formik.touched.phone && formik.errors.phone}
                label="Celular"
                name="phone"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.phone}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="expertise">Área</InputLabel>
                <Select
                  labelId="expertise"
                  id="expertise"
                  name="expertise"
                  value={formik.values.expertise}
                  label="Área"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="civil">Civil</MenuItem>
                  <MenuItem value="familia">Familia</MenuItem>
                  <MenuItem value="trabalhista">Trabalhista</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Stack divider={<Divider />} spacing={3} sx={{ mt: 7 }} />
          <Grid container spacing={3}>
            <Grid xs={12} md={2}>
              <TextField
                error={
                  !!(formik.touched.postalCode && formik.errors.postalCode)
                }
                fullWidth
                helperText={
                  formik.touched.postalCode && formik.errors.postalCode
                }
                label="CEP"
                name="postalCode"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.postalCode}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.street && formik.errors.street)}
                fullWidth
                helperText={formik.touched.street && formik.errors.street}
                label="Rua"
                name="street"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.street}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                error={!!(formik.touched.number && formik.errors.number)}
                fullWidth
                helperText={formik.touched.number && formik.errors.number}
                label="Número"
                name="number"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.number}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                error={
                  !!(formik.touched.complement && formik.errors.complement)
                }
                fullWidth
                helperText={
                  formik.touched.complement && formik.errors.complement
                }
                label="Complemento"
                name="complement"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.complement}
              />
            </Grid>
            <Grid xs={12} md={4}>
              <TextField
                error={
                  !!(formik.touched.neighborhood && formik.errors.neighborhood)
                }
                fullWidth
                helperText={
                  formik.touched.neighborhood && formik.errors.neighborhood
                }
                label="Bairro"
                name="neighborhood"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.neighborhood}
              />
            </Grid>

            <Grid xs={12} md={4}>
              <TextField
                error={!!(formik.touched.city && formik.errors.city)}
                fullWidth
                helperText={formik.touched.city && formik.errors.city}
                label="Cidade"
                name="city"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.city}
              />
            </Grid>
            <Grid xs={12} md={1}>
              <TextField
                error={!!(formik.touched.state && formik.errors.state)}
                fullWidth
                helperText={formik.touched.state && formik.errors.state}
                label="Estado"
                name="state"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.state}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={!!(formik.touched.country && formik.errors.country)}
                fullWidth
                helperText={formik.touched.country && formik.errors.country}
                label="País"
                name="country"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.country}
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

CustomerEditForm.propTypes = {
  // @ts-ignore
  customer: PropTypes.object.isRequired,
};
