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

        formik.setFieldValue("business", {
          corporateName: response.razao_social,
          cnae: response.cnae_fiscal,
          address: {
            postalCode: response.cep,
            street: response.logradouro,
            number: response.numero,
            complement: response.complemento,
            neighborhood: response.bairro,
            city: response.municipio,
            state: response.uf,
          },
        });
      } catch (error) {
        console.error("Falha ao buscar dados do CNPJ:", error);
      }
    }
  };

  const handleAddress = async (e, formik) => {
    const value = e.target.value;
    const zipCode = value.replace(/\D/g, "");

    if (zipCode.length === 8) {
      try {
        const handleDocumentresponse = await CustomersApi.getAddressByCep(
          zipCode
        );

        formik.setFieldValue("address", {
          postalCode: response.cep,
          street: response.street,
          neighborhood: response.neighborhood,
          city: response.city,
          state: response.state,
        });
      } catch (error) {
        console.error("Falha ao buscar dados do CEP:", error);
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
                        formik.touched.business?.corporateName &&
                        formik.errors.business?.corporateName
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.business?.corporateName &&
                      formik.errors.business?.corporateName
                    }
                    label="Razão Social"
                    name="business.corporateName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.business?.corporateName}
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    error={
                      !!(
                        formik.touched.business?.cnae &&
                        formik.errors.business?.cnae
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.business?.cnae &&
                      formik.errors.business?.cnae
                    }
                    label="Cnae"
                    name="business.cnae"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.business?.cnae}
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    error={
                      !!(
                        formik.touched.business?.address?.postalCode &&
                        formik.errors.business?.address?.postalCode
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.business?.address?.postalCode &&
                      formik.errors.business?.address?.postalCode
                    }
                    label="CEP"
                    name="business.address.postalCode"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.business?.address?.postalCode}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    error={
                      !!(
                        formik.touched.business?.address?.street &&
                        formik.errors.business?.address?.street
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.business?.address?.street &&
                      formik.errors.business?.address?.street
                    }
                    label="Rua"
                    name="business.address.street"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.business?.address?.street}
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    error={
                      !!(
                        formik.touched.business?.address?.number &&
                        formik.errors.business?.address?.number
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.business?.address?.number &&
                      formik.errors.business?.address?.number
                    }
                    label="Número"
                    name="business.address.number"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.business?.address?.number}
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    error={
                      !!(
                        formik.touched.business?.address?.complement &&
                        formik.errors.business?.address?.complement
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.business?.address?.complement &&
                      formik.errors.business?.address?.complement
                    }
                    label="Complemento"
                    name="business.address.complement"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.business?.address?.complement}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    error={
                      !!(
                        formik.touched.business?.address?.neighborhood &&
                        formik.errors.business?.address?.neighborhood
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.business?.address?.neighborhood &&
                      formik.errors.business?.address?.neighborhood
                    }
                    label="Bairro"
                    name="business.address.neighborhood"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.business?.address?.neighborhood}
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    error={
                      !!(
                        formik.touched.business?.address?.city &&
                        formik.errors.business?.address?.city
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.business?.address?.city &&
                      formik.errors.business?.address?.city
                    }
                    label="Cidade"
                    name="business.address.city"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.business?.address?.city}
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    error={
                      !!(
                        formik.touched.business?.address?.state &&
                        formik.errors.business?.address?.state
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.business?.address?.state &&
                      formik.errors.business?.address?.state
                    }
                    label="Estado"
                    name="business.address.state"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.business?.address?.state}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ margin: "24px 0 0 0" }}>
                    Responsável
                  </Typography>
                </Grid>
                <Grid xs={12} md={2}>
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
                  <MenuItem value="female">Feminino</MenuItem>
                  <MenuItem value="male">Masculino</MenuItem>
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
                error={!!(formik.touched.phone1 && formik.errors.phone1)}
                fullWidth
                helperText={formik.touched.phone1 && formik.errors.phone1}
                label="Celular"
                name="phone1"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.phone1}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="maritalStatus">Estado civil</InputLabel>
                <Select
                  labelId="maritalStatus"
                  id="maritalStatus"
                  name="maritalStatus"
                  value={formik.values.maritalStatus}
                  label="Estado civil"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="single">Solteiro</MenuItem>
                  <MenuItem value="married">Casado</MenuItem>
                  <MenuItem value="separated">Separado</MenuItem>
                  <MenuItem value="divorced">Divorciado</MenuItem>
                  <MenuItem value="widowed">Viúvo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Stack divider={<Divider />} spacing={3} sx={{ mt: 7 }} />
          <Grid container spacing={3}>
            <Grid xs={12} md={2}>
              <TextField
                error={
                  !!(
                    formik.touched.address?.postalCode &&
                    formik.errors.address?.postalCode
                  )
                }
                fullWidth
                helperText={
                  formik.touched.address?.postalCode &&
                  formik.errors.address?.postalCode
                }
                label="CEP"
                name="address.postalCode"
                onBlur={(e) => handleAddress(e, formik)}
                onChange={formik.handleChange}
                value={formik.values.address?.postalCode}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={
                  !!(
                    formik.touched.address?.street &&
                    formik.errors.address?.street
                  )
                }
                fullWidth
                helperText={
                  formik.touched.address?.street &&
                  formik.errors.address?.street
                }
                label="Rua"
                name="address.street"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.address?.street}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                error={
                  !!(
                    formik.touched.address?.number &&
                    formik.errors.address?.number
                  )
                }
                fullWidth
                helperText={
                  formik.touched.address?.number &&
                  formik.errors.address?.number
                }
                label="Número"
                name="address.number"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.address?.number}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                error={
                  !!(
                    formik.touched.address?.complement &&
                    formik.errors.address?.complement
                  )
                }
                fullWidth
                helperText={
                  formik.touched.address?.complement &&
                  formik.errors.address?.complement
                }
                label="Complemento"
                name="address.complement"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.address?.complement}
              />
            </Grid>
            <Grid xs={12} md={4}>
              <TextField
                error={
                  !!(
                    formik.touched.address?.neighborhood &&
                    formik.errors.address?.neighborhood
                  )
                }
                fullWidth
                helperText={
                  formik.touched.address?.neighborhood &&
                  formik.errors.address?.neighborhood
                }
                label="Bairro"
                name="address.neighborhood"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.address?.neighborhood}
              />
            </Grid>

            <Grid xs={12} md={4}>
              <TextField
                error={
                  !!(
                    formik.touched.address?.city && formik.errors.address?.city
                  )
                }
                fullWidth
                helperText={
                  formik.touched.address?.city && formik.errors.address?.city
                }
                label="Cidade"
                name="address.city"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.address?.city}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                error={
                  !!(
                    formik.touched.address?.state &&
                    formik.errors.address?.state
                  )
                }
                fullWidth
                helperText={
                  formik.touched.address?.state && formik.errors.address?.state
                }
                label="Estado"
                name="address.state"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.address?.state}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                error={
                  !!(
                    formik.touched.address?.country &&
                    formik.errors.address?.country
                  )
                }
                fullWidth
                helperText={
                  formik.touched.address?.country &&
                  formik.errors.address?.country
                }
                label="País"
                name="address.country"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.address?.country}
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
