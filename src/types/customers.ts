export interface ICustomer {
  id: string;
  name: string;
  document: string;
  cpf: string;
  rg: string;
  gender: string;
  nationality: string;
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  postalCode: string;
  email: string;
  phone: string;
  phone2: string;
  businessName: string;
  cnpj: string;
  corporateName: string;
  businessStreet: string;
  businessNumber: string;
  businessComplement: string;
  businessPostalCode: string;
  businessNeighborhood: string;
  businessCity: string;
  businessState: string;
  cnae: string;
  powers: string;
  object: string;
  fees: string;
  amount: string;
  installments: string;
  firstPayment: string;
  recurrence: string;
  lawyers: ILawyer[];
}

interface ILawyer {
  id: string;
  name: string;
  maritalStatus: string;
  nationality: string;
  address: string;
  OAB: string;
  oabBranch: string;
}

export interface ICustomers extends Array<ICustomer> {}

export interface ICustomersTable {
  count: number;
  items: ICustomers;
  onPageChange?: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  page: number;
  rowsPerPage: number;
}
