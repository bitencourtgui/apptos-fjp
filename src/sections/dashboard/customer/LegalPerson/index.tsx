import { FormikProps, FormikHelpers } from "formik";

import TextField from "@mui/material/TextField";

import CustomersApi from "@/api/customers";
import { ILegalPerson } from "@/types/legalPerson";
import { BusinessRes } from "@/types/business";
import { Unstable_Grid2 as Grid } from "@mui/material";

const setBusinessField = (
  response: BusinessRes,
  formik: FormikHelpers<ILegalPerson>
) => {
  formik.setFieldValue("business", {
    document: response.cnpj,
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
};

export const LegalPerson = (formik: FormikProps<ILegalPerson>) => {
  const handleCNPJ = async (numericValue: string) => {
    try {
      const response = await CustomersApi.getBusinessCustomer(numericValue);

      setBusinessField(response, formik);
    } catch (error) {
      console.error("Falha ao buscar dados do CNPJ:", error);
    }
  };

  const handleDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "");

    if (numericValue.length === 14) {
      await handleCNPJ(numericValue);
    }
  };

  return (
    <>
      <Grid xs={12} md={2}>
        <TextField
          error={
            !!(
              formik.touched.business?.document &&
              formik.errors.business?.document
            )
          }
          fullWidth
          helperText={
            formik.touched.business?.document &&
            formik.errors.business?.document
          }
          label="CNPJ"
          name="business.document"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleDocument(e)
          }
          onBlur={formik.handleBlur}
          required
          value={formik.values.business?.document || ''}
        />
      </Grid>

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
            !!(formik.touched.business?.cnae && formik.errors.business?.cnae)
          }
          fullWidth
          helperText={
            formik.touched.business?.cnae && formik.errors.business?.cnae
          }
          label="Cnae"
          name="business.cnae"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          required
          value={formik.values.business?.cnae}
        />
      </Grid>
      <Grid xs={12} md={6}>
        <TextField
          error={
            !!(formik.touched.business?.email && formik.errors.business?.email)
          }
          fullWidth
          helperText={
            formik.touched.business?.email && formik.errors.business?.email
          }
          label="Email"
          name="business.email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.business?.email}
        />
      </Grid>
      <Grid xs={12} md={6}>
        <TextField
          error={
            !!(formik.touched.business?.phone && formik.errors.business?.phone)
          }
          fullWidth
          helperText={
            formik.touched.business?.phone && formik.errors.business?.phone
          }
          label="Telefone"
          name="business.phone"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.business?.phone}
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
    </>
  );
};
