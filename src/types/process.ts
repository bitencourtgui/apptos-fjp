import { FormikHelpers } from "formik";

export interface IProcess {
  number: string;
  class: string;
  status: string;
  area: string;
  subject: string;
  price: string;
  division: string;
  exeqte: string;
  customerId: string;
  court: string;
  exectdo: string;
  others: string;
  control: string;
  distribution: string;
  judge: string;
  id?: string;
  divisionPhone: string;
  divisionEmail: string;
  extra: string;
}

export interface IFormProcess {
  handleSubmit: (values: IProcess, actions: FormikHelpers<IProcess>) => void;
  source?: IProcess;
}
