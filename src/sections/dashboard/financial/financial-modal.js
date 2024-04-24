import React, { useState, useCallback } from "react";
import {
  Button,
  CardActions,
  CardContent,
  DialogTitle,
  IconButton,
  Drawer,
  Typography,
  Divider,
  FormControlLabel,
  TextField,
  Switch,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useFormik } from "formik";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import { PaymentInitial } from "./financial-initial";
import toast from "react-hot-toast";
import { paymentSchema } from "./financial-schema";
import { convertToISODate } from "../../../utils/convert-ISO-date";
import { v4 as uuidv4 } from "uuid";
import { createHash } from "crypto";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import FinancialApi from "../../../api/financial";

const PaymentModal = ({
  open,
  handleToggle,
  customerId,
  itemsData,
  edit,
  reload,
}) => {
  dayjs.locale("pt-br");

  const [frequency, setFrequency] = useState("monthly");

  const initialValues = {
    frequency: "indetermined",
    firstPayment: dayjs().toDate(),
  };

  function generateShortUniqueString(input) {
    const hash = createHash("md5").update(input).digest("hex");
    const alphanumericOnly = hash.replace(/[^A-Z0-9]/gi, "");
    return alphanumericOnly.substr(0, 25).toUpperCase();
  }

  const createInstallments = (
    customerID,
    frequency,
    total,
    entrada,
    parcelas,
    primeiroPagamento,
    recorrenciaDia,
    fees
  ) => {
    const installments = [];
    const valorParcela = total / parcelas;

    for (let i = 0; i < parcelas; i++) {
      const vencimentoParcela = new Date(convertToISODate(primeiroPagamento));

      // Ajuste para considerar o recorrenciaDia
      if (i > 0) {
        vencimentoParcela.setMonth(vencimentoParcela.getMonth() + i);
      }

      // Define o dia da recorrência
      vencimentoParcela.setDate(recorrenciaDia);

      // Ajuste para a primeira parcela
      if (i === 0) {
        vencimentoParcela.setMonth(vencimentoParcela.getMonth() - 1);

        const [dia, mes, ano] = primeiroPagamento.split("/");

        const diaNumero = parseInt(dia, 10);
        const mesNumero = parseInt(mes, 10);
        const anoNumero = parseInt(ano, 10);

        vencimentoParcela.setFullYear(anoNumero, mesNumero - 1, diaNumero);
      }

      const installment = {
        installmentsId: generateShortUniqueString(
          `${valorParcela.toFixed(2)}/${i}`
        ),
        installmentNumber: i + 1,
        installmentDownPayment: entrada ?? 0,
        installmentTotal: total,
        installmentsRecorrence: recorrenciaDia,
        installmentValue: valorParcela.toFixed(2),
        dueDate: dayjs(vencimentoParcela).format("DD/MM/YYYY"),
        installmentStatus: "Pendente",
        frequency,
        fees: fees ? fees : 0,
      };

      installments.push(installment);
    }

    const newPayment = {
      id: uuidv4(),
      installments,
    };

    if (itemsData?.length >= 1) {
      return { customerID, payments: [...itemsData, newPayment] };
    }

    return { customerID, payments: [newPayment] };
  };

  const handleStatusChange = useCallback((event) => {
    setFrequency(event.target.checked ? "indetermined" : "monthly");
  }, []);

  const formik = useFormik({
    initialValues: initialValues || PaymentInitial,
    validationSchema: paymentSchema,
    onSubmit: async (values, helpers) => {
      const totalValue = values.downPayment
        ? values.amount - values.downPayment
        : values.monthlyPayment * values.installments;

      const financialData = createInstallments(
        customerId.toString(),
        values.frequency,
        totalValue,
        values.downPayment,
        values.installments,
        values.firstPayment,
        values.recurrence,
        values.fees
      );

      try {
        const response = await FinancialApi.setInvoices(
          customerId,
          financialData
        );

        if (response.status === 200) {
          toast.success("Movimentação cadastrada");
          helpers.setStatus({ success: true });
          helpers.setSubmitting(false);
          reload();
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <Drawer open={open} anchor="right" onClose={() => handleToggle(false)}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>Forma de pagamento</Typography>
        <IconButton
          aria-label="delete"
          onClick={() => handleToggle(false)}
          sx={{ padding: "0" }}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </DialogTitle>
      <Divider />

      <form onSubmit={formik.handleSubmit}>
        <CardContent
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            width: "380px",
            gap: "8px",
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={frequency === "indetermined"}
                onChange={handleStatusChange}
              />
            }
            label={frequency === "monthly" ? "Mensal" : "Indeterminado"}
          />

          {frequency === "indetermined" && (
            <>
              <TextField
                error={!!(formik.touched.amount && formik.errors.amount)}
                fullWidth
                helperText={formik.touched.amount && formik.errors.amount}
                label="Valor Total"
                name="amount"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.amount}
              />
              <TextField
                error={
                  !!(formik.touched.downPayment && formik.errors.downPayment)
                }
                fullWidth
                helperText={
                  formik.touched.downPayment && formik.errors.downPayment
                }
                label="Entrada"
                name="downPayment"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.downPayment}
              />
            </>
          )}

          {frequency === "monthly" && (
            <TextField
              error={
                !!(
                  formik.touched.monthlyPayment && formik.errors.monthlyPayment
                )
              }
              fullWidth
              helperText={
                formik.touched.monthlyPayment && formik.errors.monthlyPayment
              }
              label="Mensalidade"
              name="monthlyPayment"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              required
              value={formik.values.monthlyPayment}
            />
          )}

          <TextField
            error={
              !!(formik.touched.installments && formik.errors.installments)
            }
            fullWidth
            helperText={
              formik.touched.installments && formik.errors.installments
            }
            label={frequency === "indetermined" ? "Parcelas" : "Periodicidade"}
            name="installments"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            required
            value={formik.values.installments}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Primeiro pagamento"
              name="firstPayment"
              id="firstPayment"
              value={dayjs(formik.values.firstPayment, "DD/MM/YYYY").format(
                "YYYY-MM-DD"
              )}
              onChange={(newValue) =>
                formik.setFieldValue(
                  "firstPayment",
                  dayjs(newValue).format("DD/MM/YYYY")
                )
              }
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <TextField
            error={!!(formik.touched.recurrence && formik.errors.recurrence)}
            fullWidth
            helperText={formik.touched.recurrence && formik.errors.recurrence}
            label="Recorrência"
            name="recurrence"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            required
            value={formik.values.recurrence}
          />

          {frequency === "indetermined" && (
            <TextField
              error={!!(formik.touched.fees && formik.errors.fees)}
              fullWidth
              helperText={formik.touched.fees && formik.errors.fees}
              label="Honorários"
              name="fees"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              required
              InputProps={{
                endAdornment: <PercentOutlinedIcon />,
              }}
              value={formik.values.fees}
            />
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", px: 3 }}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            onClick={() => handleToggle(false)}
          >
            {edit ? `Atualizar` : `Cadastrar`}
          </Button>
        </CardActions>
      </form>
    </Drawer>
  );
};

export default PaymentModal;
