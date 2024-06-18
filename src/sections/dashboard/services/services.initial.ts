import dayjs from "dayjs";

export const PaymentInitial = {
  amount: "",
  installments: "",
  firstPayment: dayjs(),
  recurrence: "",
  fees: 0,
  frequency: "indetermined"
};
