export interface Installment {
    fees: number;
    installmentsId: string;
    installmentNumber: number;
    installmentValue: string;
    dueDate: string;
    installmentStatus: string;
    frequency: number;
    installmentDownPayment: number;
    installmentTotal: number;
    installmentsRecorrence: number;
  }
  
  export interface Payment {
    installments: Installment[];
    id: string;
  }
  
  export interface Payments {
    payments: Payment[];
    customerID: string;
    id?: string;
  }
  
  