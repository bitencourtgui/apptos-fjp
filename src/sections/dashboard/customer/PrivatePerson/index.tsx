import { FormikProps } from "formik";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import {
  FormControlLabel,
  Unstable_Grid2 as Grid,
  Switch,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { PrivatePersonProps } from "@/types/privatePerson";
import CustomersApi from "@/api/customers";

interface PrivatePersonWithPocket extends FormikProps<PrivatePersonProps> {
  pocket?: boolean;
}

export const PrivatePerson = (formik: PrivatePersonWithPocket) => {
  const handleAddress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const zipCode = value.replace(/\D/g, "");

    if (zipCode.length === 8) {
      try {
        const response = await CustomersApi.getAddressByCep(zipCode);

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
    <>
      {formik.pocket && (
        <Grid pb={1}>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                edge="start"
                name="managingPartner"
                checked={formik.values.managingPartner}
                onChange={() =>
                  formik.setFieldValue(
                    "managingPartner",
                    !formik.values.managingPartner
                  )
                }
              />
            }
            label={`Sócio ${
              formik.values.managingPartner ? " Administrador" : "Comum"
            }`}
            sx={{ pl: 2 }}
          />
        </Grid>
      )}
      <Grid xs={12} md={2}>
        <TextField
          error={!!(formik.touched.document && formik.errors.document)}
          fullWidth
          helperText={formik.touched.document && formik.errors.document}
          label="CPF"
          name="document"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          value={formik.values.document}
        />
      </Grid>
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
          error={!!(formik.touched.nationality && formik.errors.nationality)}
          fullWidth
          helperText={formik.touched.nationality && formik.errors.nationality}
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
      {!formik.pocket && (
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
      )}
        <Grid xs={12} md={3}>
          <TextField
            error={!!(formik.touched.occupation && formik.errors.occupation)}
            fullWidth
            helperText={formik.touched.occupation && formik.errors.occupation}
            label="Profissão"
            name="occupation"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.occupation}
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
      {!formik.pocket && (
        <Grid xs={12} md={3}>
          <TextField
            error={!!(formik.touched.phone && formik.errors.phone)}
            fullWidth
            helperText={formik.touched.phone && formik.errors.phone}
            label="Celular"
            name="phone"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            required
            value={formik.values.phone}
          />
        </Grid>
      )}
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
      <Grid xs={12} p={formik.pocket && 2}>
        <Divider orientation="horizontal" />
      </Grid>
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
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleAddress(e)}
          onChange={formik.handleChange}
          value={formik.values.address?.postalCode}
        />
      </Grid>
      {!formik.pocket && (
        <Grid xs={12} md={6}>
          <TextField
            error={
              !!(
                formik.touched.address?.street && formik.errors.address?.street
              )
            }
            fullWidth
            helperText={
              formik.touched.address?.street && formik.errors.address?.street
            }
            label="Rua"
            name="address.street"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.address?.street}
          />
        </Grid>
      )}

      <Grid xs={12} md={2}>
        <TextField
          error={
            !!(formik.touched.address?.number && formik.errors.address?.number)
          }
          fullWidth
          helperText={
            formik.touched.address?.number && formik.errors.address?.number
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
      {!formik.pocket && (
        <>
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
                !!(formik.touched.address?.city && formik.errors.address?.city)
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
                  formik.touched.address?.state && formik.errors.address?.state
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
        </>
      )}
    </>
  );
};
