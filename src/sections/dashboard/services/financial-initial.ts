import dayjs from "dayjs";

export const iOpeningService = {
  cashPayment: false,
  openingContract: '',
  paymentDate: "10",
};


export const iAccountingService = {
  paymentEntry: false,
  accountingPayment: '',
  billingRange: '',
  accountingFee: '',
 accountingDate: dayjs().toDate(),
};