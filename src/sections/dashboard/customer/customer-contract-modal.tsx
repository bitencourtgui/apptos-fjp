import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NumericFormat } from "react-number-format";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CustomersApi from "../../../api/customers";

export default function ContractModal({
  open,
  handleToggle,
  contract,
  customer,
}) {
  const router = useRouter();

  const contractType = contract?.name === "Contabilidade";

  const formik = useFormik({
    initialValues: {
      openingContract: 1412,
      billingRange: 0,
      accountingFee: 0,
      accountingPayment: 0,
      cashPayment: false,
      openingDate: new Date(),
      accountingDate: new Date(),
      contractStartDate: new Date(),
    },
    validationSchema: Yup.object({
      openingContract: Yup.number(),
      openingDate: Yup.date(),
      accountingFee: Yup.number(),
      accountingPayment: Yup.number(),
      accountingDate: Yup.date(),
      cashPayment: Yup.boolean(),
      contractStartDate: Yup.date(),
    }),
    onSubmit: async (values) => {
      const payload = {
        ...customer,
        contractStartDate: dayjs(values.contractStartDate).format("DD/MM/YYYY"),
        servicesDetails: {
          1: {
            openingDate: dayjs(values.openingDate).format("DD/MM/YYYY"),
            openingContract: values.openingContract,
            cashPayment: values.cashPayment,
          },
          2: {
            billingRange: values.billingRange,
            accountingFee: values.accountingFee,
            accountingPayment: values.accountingPayment,
            accountingDate: dayjs(values.accountingDate).format("DD/MM/YYYY"),
          },
        },
      };

      // const response = await CustomersApi.setCustomer(customer?.id, payload);

      // if (response.status === 200) {
      //   handleContract(customer?.id);
      // }
    },
  });

  const handleContract = (id: string) => {
    // window.open(`/contratos/hipossuficiencia/${id}`, "_blank");
    router.push(`/contratos/contabilidade/${id}`);
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleToggle(false)}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth
    >
      <DialogTitle
        id="scroll-dialog-title"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography>Gerar contrato de {contract?.name}</Typography>
        <IconButton
          aria-label="delete"
          onClick={() => handleToggle(false)}
          sx={{ padding: "0" }}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers={true}>
          {contractType && customer?.services ? (
            <Box display="flex" flexDirection="column" gap={4}>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography>
                  Data de inicicio da vigência do contrato
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Data de inicio de contrato"
                    value={dayjs(formik.values.contractStartDate).toDate()}
                    onChange={(newValue) =>
                      formik.setFieldValue(
                        "contractStartDate",
                        dayjs(newValue).format("YYYY-MM-DD")
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="contractStartDate"
                        id="contractStartDate"
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>

              {customer.services.includes("0") && (
                <>
                  <Divider />

                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography>Abertura de empresa</Typography>

                    <NumericFormat
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      prefix={"R$ "}
                      value={formik.values.openingContract}
                      onValueChange={(values) => {
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
                        formik.touched.openingContract &&
                        formik.errors.openingContract
                      }
                      fullWidth
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          color="primary"
                          edge="start"
                          name="cashPayment"
                          checked={formik.values.cashPayment}
                          onChange={() =>
                            formik.setFieldValue(
                              "cashPayment",
                              !formik.values.cashPayment
                            )
                          }
                        />
                      }
                      label="Pagamento a vista? -usa?"
                      sx={{ pl: 2 }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Data de pagamento"
                        value={dayjs(formik.values.openingDate).toDate()}
                        onChange={(newValue) =>
                          formik.setFieldValue(
                            "openingDate",
                            dayjs(newValue).format("YYYY-MM-DD")
                          )
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="openingDate"
                            id="openingDate"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>
                </>
              )}
              {customer?.services.includes("1") && (
                <>
                  <Divider />

                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography>Contabilidade Empresarial</Typography>
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
                        formik.touched.billingRange &&
                        Boolean(formik.errors.billingRange)
                      }
                      helperText={
                        formik.touched.billingRange &&
                        formik.errors.billingRange
                      }
                      fullWidth
                    />
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
                        formik.touched.accountingPayment &&
                        formik.errors.accountingPayment
                      }
                      fullWidth
                    />
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
                        formik.touched.accountingFee &&
                        Boolean(formik.errors.accountingFee)
                      }
                      helperText={
                        formik.touched.accountingFee &&
                        formik.errors.accountingFee
                      }
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
                          <TextField
                            {...params}
                            name="accountingDate"
                            id="accountingDate"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>
                </>
              )}
              {customer.services.includes("2") && (
                <>
                  <Divider />

                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography>Desenquadramento empresa</Typography>

                    <NumericFormat
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      prefix={"R$ "}
                      value={formik.values.openingContract}
                      onValueChange={(values) => {
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
                        formik.touched.openingContract &&
                        formik.errors.openingContract
                      }
                      fullWidth
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          color="primary"
                          edge="start"
                          name="cashPayment"
                          checked={formik.values.cashPayment}
                          onChange={() =>
                            formik.setFieldValue(
                              "cashPayment",
                              !formik.values.cashPayment
                            )
                          }
                        />
                      }
                      label="Pagamento a vista? -usa?"
                      sx={{ pl: 2 }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Data de pagamento"
                        value={dayjs(formik.values.openingDate).toDate()}
                        onChange={(newValue) =>
                          formik.setFieldValue(
                            "openingDate",
                            dayjs(newValue).format("YYYY-MM-DD")
                          )
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="openingDate"
                            id="openingDate"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>
                </>
              )}
            </Box>
          ) : (
            "Em breve"
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleToggle(false)} color="primary">
            Cancelar
          </Button>
          <Button type="submit" color="primary">
            Gerar Contrato
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
