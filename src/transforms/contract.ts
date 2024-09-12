import { formatDate } from "@/utils/format-date";
import { maskDocument } from "@/utils/mask-document";
import { translateMaritalStatus } from "@/utils/translate";

type MaritalStatus = "single" | "married" | "divorced" | "widowed";
type Gender = "male" | "female";

interface Address {
  street: string;
  neighborhood: string;
  number?: string;
  state: string;
  complement?: string;
  postalCode: string;
  city: string;
  country?: string;
}

interface Partner {
  rg: string;
  maritalStatus: MaritalStatus;
  document: string;
  occupation: string;
  gender: Gender;
  address: Address;
  name: string;
  nationality: string;
}

interface Business {
  email: string;
  corporateName: string;
  phone: string;
  address: Address;
  cnae: string;
  document: string;
}

export interface OriginalPayload {
  maritalStatus: MaritalStatus;
  cnae: string;
  name: string;
  id: string;
  email: string;
  rg: string;
  document: string;
  partners?: Partner[];
  address: Address;
  business?: Business;
  gender: Gender;
  nationality: string;
  contracts?: Array<{
    id: string;
    name: string;
    serviceId: string;
    completed: boolean;
  }>;
  services: Array<{
    paymentDate: string;
    createdAt: string;
    serviceType: string;
    cashPayment: boolean;
    openingContract: string;
    id: string;
    accountingFee: string;
    accountingPayment: string;
    billingRange: string;
    accountingDate: string;
    paymentEntry: boolean;
  }>;
  phone: string;
}

interface TransformedPayload {
  userId: string;
  number: string;
  completed: boolean;
  persons: Array<{
    name: string;
    nationality: string;
    maritalStatus: string;
    occupation?: string;
    document: string;
    rg: string;
    address: string;
    phone: string;
    email: string;
  }>;
  services: Array<{
    name: string;
    cashPayment: boolean;
    createdAt: string;
    id: string;
    openingContract: string;
    paymentDate: string;
    type: string;
    accountingFee: string;
    accountingPayment: string;
    billingRange: string;
    accountingDate: string;
    paymentEntry: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

const servicesMap = {
  "0": "Abertura de Empresa",
  "1": "Contabilidade Empresarial",
  "2": "Desenquadramento",
  "3": "Planejamento Tributário",
  "4": "Isenção de IR",
  "5": "Defesa Administrativa",
};



export const transformContractPayload = (
  originalPayload: OriginalPayload,
): TransformedPayload => {
  const persons = [];

  const isBusiness = originalPayload?.business?.corporateName?.length
    ? originalPayload.business.corporateName.length > 1
    : false;

  const document = isBusiness
    ? originalPayload?.business?.document
    : originalPayload?.document;
  const contractNumber = document?.substring(0, 8);

  if (!isBusiness) {
    persons.push({
      name: originalPayload?.name,
      nationality: originalPayload?.nationality,
      maritalStatus: translateMaritalStatus(
        originalPayload?.maritalStatus,
        originalPayload?.gender,
      ),
      document: maskDocument(originalPayload?.document),
      rg: originalPayload?.rg,
      address: `${originalPayload?.address?.street}, ${originalPayload?.address?.number}, ${originalPayload?.address?.neighborhood}, ${originalPayload?.address?.city} - ${originalPayload?.address?.state}, ${originalPayload?.address?.postalCode}`,
      phone: originalPayload?.phone ?? "",
      email: originalPayload?.email ?? "",
    });
  }

  if (originalPayload?.partners) {
    persons.push(
      ...originalPayload?.partners.map((partner) => ({
        name: partner.name,
        nationality: partner.nationality,
        maritalStatus: translateMaritalStatus(
          partner.maritalStatus,
          partner.gender,
        ),
        occupation: partner.occupation,
        document: maskDocument(partner.document),
        rg: partner.rg,
        address: `${partner.address?.street}, ${
          partner.address?.number || ""
        }, ${partner.address?.neighborhood}, ${partner.address?.city} - ${
          partner.address?.state
        }, ${partner.address?.postalCode}`,
        phone: "", // valor padrão
        email: "", // valor padrão
      })),
    );
  }

  return {
    userId: originalPayload?.id ?? "",
    number: `${contractNumber}-001`,
    persons,
    completed: false,
    services: originalPayload?.services.map((service) => ({
      id: service.id ?? "",
      name: servicesMap[service.serviceType as keyof typeof servicesMap] ?? "",
      cashPayment: service.cashPayment ?? false,
      openingContract: service.openingContract ?? "",
      paymentDate: service.paymentDate ?? "",
      type: service.serviceType ?? "",
      createdAt: formatDate(service.createdAt) ?? "",
      accountingPayment: service.accountingPayment ?? "",
      accountingFee: service.accountingFee ?? "",
      billingRange: service.billingRange ?? "",
      accountingDate: formatDate(service.accountingDate) ?? "",
      paymentEntry: service.paymentEntry ?? false,
    })),
    createdAt: formatDate(new Date()),
    updatedAt: formatDate(new Date()),
  };
};
