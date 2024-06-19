import { Address } from "@/types/address";

export interface ILegalPerson {
    business: {
      document: string;
      corporateName: string;
      cnae: string;
      address: Address;
      phone: string;
      email: string
    };
  }