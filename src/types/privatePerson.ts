import { Address } from "./address";

export interface PrivatePersonProps {
    document: string;
    name: string;
    nationality: string;
    gender: string;
    email: string;
    rg: string;
    phone: string;
    maritalStatus: string;
    address: Address;
    managingPartner?: boolean;
  }