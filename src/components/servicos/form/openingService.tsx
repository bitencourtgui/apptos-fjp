import { FormikProps } from "formik";
import { NumericFormat } from "react-number-format";

import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// interface OpeningServiceProps {
//   paymentEntry: boolean;
//   cashPayment: boolean;
//   openingContract: string;
//   accountingPayment: string;
//   paymentMethod: "creditcard" | "bankslip";
//   monthyFee: string;
//   paymentDate: "10" | "15" | "20";
//   cashPaymentDate: Date;
// }

export const OpeningService = (
  formik: any
): JSX.Element => {
  const currentDay = dayjs().date();

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <FormControlLabel
        control={
          <Switch
            color="primary"
            edge="start"
            name="cashPayment"
            checked={formik.values.cashPayment}
            onChange={() =>
              formik.setFieldValue("cashPayment", !formik.values.cashPayment)
            }
          />
        }
        label="Pagamento a vista?"
        sx={{ pl: 2 }}
      />
      <NumericFormat
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        prefix={"R$ "}
        value={formik.values.openingContract}
        onValueChange={(values: any) => {
          formik.setFieldValue("openingContract", values.value);
        }}
        customInput={TextField}
        label="Valor da taxa de abertura"
        name="openingContract"
        error={
          formik.touched.openingContract &&
          Boolean(formik.errors.openingContract)
        }
        helperText={
          formik.touched.openingContract && formik.errors.openingContract
        }
        fullWidth
      />

      {!formik.values.cashPayment && (
        <>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                edge="start"
                name="paymentEntry"
                checked={formik.values.paymentEntry}
                onChange={() =>
                  formik.setFieldValue(
                    "paymentEntry",
                    !formik.values.paymentEntry
                  )
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
              onValueChange={(values: any) => {
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
                formik.touched.accountingPayment &&
                formik.errors.accountingPayment
              }
              fullWidth
            />
          )}
          <FormControl fullWidth>
            <InputLabel id="paymentMethod">Método de pagamento</InputLabel>
            <Select
              labelId="paymentMethod"
              id="paymentMethod"
              name="paymentMethod"
              label="Método de Pagamento"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.paymentMethod}
              error={
                !!(formik.touched.paymentMethod && formik.errors.paymentMethod)
              }
            >
              <MenuItem value="bankslip">Boleto</MenuItem>
              <MenuItem value="creditcard">Cartão de crédito</MenuItem>
            </Select>
            {formik.touched.paymentMethod && formik.errors.paymentMethod && (
              <FormHelperText>{formik.errors.paymentMethod}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="monthyFee">Parcelas</InputLabel>
            <Select
              labelId="monthyFee"
              id="monthyFee"
              name="monthyFee"
              label="Parcelas"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.monthyFee}
              error={!!(formik.touched.monthyFee && formik.errors.monthyFee)}
            >
              {[
                ...Array(formik.values.paymentMethod === "bankslip" ? 8 : 12),
              ].map((_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.paymentMethod && formik.errors.paymentMethod && (
              <FormHelperText>{formik.errors.paymentMethod}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="paymentDate">Data de Pagamento</InputLabel>
            <Select
              labelId="paymentDate"
              id="paymentDate"
              name="paymentDate"
              label="Data de Pagamento"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.paymentDate}
              error={
                !!(formik.touched.paymentDate && formik.errors.paymentDate)
              }
            >
              {currentDay <= 10 && <MenuItem value="10">10</MenuItem>}
              {currentDay <= 15 && <MenuItem value="15">15</MenuItem>}
              <MenuItem value="20">20</MenuItem>
            </Select>
            {formik.touched.paymentDate && formik.errors.paymentDate && (
              <FormHelperText>{formik.errors.paymentDate}</FormHelperText>
            )}
          </FormControl>
        </>
      )}
      {formik.values.cashPayment && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Data de pagamento"
            value={dayjs(formik.values.cashPaymentDate)}
            onChange={(newValue) =>
              formik.setFieldValue(
                "cashPaymentDate",
                dayjs(newValue).format("YYYY-MM-DD")
              )
            }
            renderInput={(params: any) => (
              <TextField
                {...params}
                name="cashPaymentDate"
                id="cashPaymentDate"
              />
            )}
          />
        </LocalizationProvider>
      )}
    </Box>
  );
};
