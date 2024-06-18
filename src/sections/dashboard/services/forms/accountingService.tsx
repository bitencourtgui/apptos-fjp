import dayjs from "dayjs";
import { FormikProps } from "formik";
import { NumericFormat } from "react-number-format";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FormControlLabel, Switch } from "@mui/material";

interface OpeningServiceProps {
  paymentEntry: boolean;
  accountingPayment: string;
  billingRange: string;
  accountingFee: string;
  accountingDate: Date;
}

export const AccountingService = (
  formik: FormikProps<OpeningServiceProps>
): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <FormControlLabel
        control={
          <Switch
            color="primary"
            edge="start"
            name="paymentEntry"
            checked={formik.values.paymentEntry}
            onChange={() =>
              formik.setFieldValue("paymentEntry", !formik.values.paymentEntry)
            }
          />
        }
        label="O pagamento possui entrada?"
        sx={{ pl: 2 }}
      />
      {formik.values.paymentEntry && (
        <NumericFormat
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          prefix={"R$ "}
          value={formik.values.accountingPayment}
          onValueChange={(values) => {
            formik.setFieldValue("accountingPayment", values.value);
          }}
          customInput={TextField}
          label="Valor de entrada"
          name="accountingPayment"
          error={
            formik.touched.accountingPayment &&
            Boolean(formik.errors.accountingPayment)
          }
          helperText={
            formik.touched.accountingPayment && formik.errors.accountingPayment
          }
          fullWidth
        />
      )}

      <NumericFormat
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        prefix={"R$ "}
        value={formik.values.accountingFee}
        onValueChange={(values) => {
          formik.setFieldValue("accountingFee", values.value);
        }}
        customInput={TextField}
        label="Valor da mensalidade contábil"
        name="accountingFee"
        error={
          formik.touched.accountingFee && Boolean(formik.errors.accountingFee)
        }
        helperText={formik.touched.accountingFee && formik.errors.accountingFee}
        fullWidth
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Data de pagamento"
          value={dayjs(formik.values.accountingDate).toDate()}
          onChange={(newValue) =>
            formik.setFieldValue(
              "accountingDate",
              dayjs(newValue).format("YYYY-MM-DD")
            )
          }
          renderInput={(params) => (
            <TextField {...params} name="accountingDate" id="accountingDate" />
          )}
        />
      </LocalizationProvider>

      <NumericFormat
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        prefix={"R$ "}
        value={formik.values.billingRange}
        onValueChange={(values) => {
          formik.setFieldValue("billingRange", values.value);
        }}
        customInput={TextField}
        label="Faturamento"
        name="billingRange"
        error={
          formik.touched.billingRange && Boolean(formik.errors.billingRange)
        }
        helperText={formik.touched.billingRange && formik.errors.billingRange}
        fullWidth
      />
    </Box>
  );
};
