"use client";

import { useContract } from "@/hooks/use-contracts";
import { PDFViewer, Text } from "@react-pdf/renderer";
import { ContabilidadeDesenquadramento } from "./contabilidade-desenquadramento";
import { AberturaDeEmpresa } from "./abertura-empresa";
// CONTRATOS

export const ContractTypes = ({ id }: any) => {
  const { contract } = useContract(id);

  if (contract) {
    const tipos = contract.services.map(({ type }: any) => type);

    if (tipos.includes("0")) {
      return <AberturaDeEmpresa contract={contract} />;
    }

    if (tipos.includes("1") || tipos.includes("2")) {
      return <ContabilidadeDesenquadramento contract={contract} />;
    }

    // Se o contrato não tiver "0", "1", ou "2" como tipo
    return <Text>OUTROS</Text>;
  }

  // Se o contrato não estiver disponível ainda
  return <Text>NÃO DISPONIVEL</Text>;
};
