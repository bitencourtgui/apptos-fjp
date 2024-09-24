"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Avatar,
  Button,
  Card,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Certificate01 } from "@untitled-ui/icons-react";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import { useContract, useContractsByUserId } from "@/hooks/use-contracts";
import dynamic from "next/dynamic";
import { AberturaDeEmpresa } from "./tipos/abertura-empresa";
import { SeverityPill } from "../core/severity-pill";
import { formatDate } from "@/utils/format-date";

const ContractDialog = dynamic(() =>
  import("./contract-dialog").then((mod) => mod.ContractDialog),
);
const AutentiqueModal = dynamic(() =>
  import("./autentique/modal").then((mod) => mod.AutentiqueModal),
);

const statusColorsMap: Record<string, "error" | "success" | "warning"> = {
  canceled: "error",
  paid: "success",
  pending: "warning",
};

export const ContractList = React.memo(({ id }: { id: string }) => {
  const { contracts } = useContractsByUserId(id);
  const { updateContract } = useContract();
  const [openPdf, setOpenPdf] = useState(false);
  const [autOpen, setAutOpen] = useState(false);
  const [contractId, setContractId] = useState("");
  const [selectedContract, setSelectedContract] = useState<any>(null);

  const handleContract = useCallback((id: string) => {
    setContractId(id);
    setOpenPdf(true);
  }, []);

  const getPdfBlob = useCallback(async (contract: any) => {
    const blobPdf = await pdf(
      <AberturaDeEmpresa contract={contract} />,
    ).toBlob();
    return blobPdf;
  }, []);

  const handleCreateDocument = useCallback(
    async (contractId: string) => {
      try {
        const contract = contracts.find((c: any) => c.id === contractId);
        if (!contract) throw new Error("Contract not found");

        const servicesTypes = contract.services
          .map(({ type }: any) => type)
          .join(", ");

        const blobPdf = await getPdfBlob(contract);

        const formData = new FormData();
        formData.append(
          "file",
          blobPdf,
          `contrato-${contract?.number}.${servicesTypes}.pdf`,
        );

        const documentData = {
          name: `contrato: ${contract?.number} [${servicesTypes}].pdf`,
        };
        const signersData = contract.persons.map((person: any) => ({
          name: person.name,
          phone: `+551140028922`,
          delivery_method: "DELIVERY_METHOD_LINK",
          action: "SIGN",
        }));

        formData.append("document", JSON.stringify(documentData));
        formData.append("signers", JSON.stringify(signersData));

        const response = await fetch("/api/autentique/create-document", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        const updateData = {
          autentique: {
            id: result.createDocument.id,
            name: result.createDocument.name,
            created_at: result.createDocument.created_at,
            signatures: result.createDocument.signatures.map(
              (signature: any) => ({
                public_id: signature.public_id,
                name: signature.name,
                email: signature.email,
                created_at: signature.created_at,
                action: signature.action?.name || null,
                link: signature.link?.short_link || null,
                user: {
                  id: signature.user.id,
                  name: signature.user.name,
                  email: signature.user.email,
                },
              }),
            ),
          },
        };

        updateContract(updateData, contractId);
      } catch (err) {
        console.error("Error executing mutation", err);
      }
    },
    [contracts, getPdfBlob, updateContract],
  );

  const handleOpenAutentique = useCallback((contract: any) => {
    setSelectedContract(contract);
    setAutOpen(true);
  }, []);

  const handleCloseAutentique = useCallback(() => {
    setAutOpen(false);
  }, []);

  // Memoize da lista de contratos para evitar reprocessamento em renderizações subsequentes
  const renderedContracts = useMemo(
    () =>
      contracts.map((contract: any) => {
        const serviceNames = contract.services
          .map(({ name }: any) => name)
          .join(", ");
        const status = contract.completed ? "paid" : "pending";
        const hasAutentique = Boolean(contract?.autentique);

        return (
          <TableRow key={contract.id}>
            <TableCell width="25%">
              <Stack
                alignItems="center"
                direction="row"
                spacing={2}
                sx={{ display: "inline-flex", whiteSpace: "nowrap" }}
              >
                <Avatar sx={{ height: 42, width: 42 }}>
                  <SvgIcon>
                    <Certificate01 />
                  </SvgIcon>
                </Avatar>
                <div>
                  <Typography color="text.primary" variant="subtitle2">
                    Contrato
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    sx={{
                      maxWidth: 250,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {serviceNames}
                  </Typography>
                </div>
              </Stack>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Criação</Typography>
              <Typography color="text.secondary" variant="body2">
                {formatDate(contract.createdAt)}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Atualização</Typography>
              <Typography color="text.secondary" variant="body2">
                {formatDate(contract.updatedAt)}
              </Typography>
            </TableCell>
            <TableCell align="right">
              {hasAutentique && (
                <SeverityPill color={statusColorsMap[status]}>
                  {contract.completed ? "Concluído" : "Pendente"}
                </SeverityPill>
              )}
            </TableCell>
            <TableCell align="right">
              <Stack
                alignItems="center"
                direction="row"
                spacing={2}
                justifyContent="flex-end"
              >
                {hasAutentique ? (
                  <Button
                    color="inherit"
                    onClick={() => handleOpenAutentique(contract)}
                  >
                    Links
                  </Button>
                ) : (
                  <Button
                    color="inherit"
                    onClick={() => handleCreateDocument(contract.id)}
                  >
                    Assinar
                  </Button>
                )}
                <PDFDownloadLink
                  document={<AberturaDeEmpresa contract={contract} />}
                  fileName={`contrato:${contract?.number} - ${serviceNames}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button color="primary" variant="contained">
                    Baixar
                  </Button>
                </PDFDownloadLink>
              </Stack>
            </TableCell>
          </TableRow>
        );
      }),
    [contracts, handleOpenAutentique, handleCreateDocument],
  );

  return (
    <>
      <Stack spacing={2}>
        <Typography color="text.secondary" variant="h6">
          Em aberto ({contracts.length})
        </Typography>
        <Card>
          <Table sx={{ minWidth: 600 }}>
            <TableBody>{renderedContracts}</TableBody>
          </Table>
        </Card>
      </Stack>
      <ContractDialog
        id={contractId}
        onClose={() => setOpenPdf(false)}
        open={openPdf}
      />
      <AutentiqueModal
        open={autOpen}
        handleClose={handleCloseAutentique}
        contract={selectedContract}
      />
    </>
  );
});

// Adicione um displayName ao componente memoizado
ContractList.displayName = "ContractList";
