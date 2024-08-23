import { SeverityPill } from "@/components/severity-pill";
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
import { Scrollbar } from "@/components/scrollbar";
import { useContractsByUserId } from "@/hooks/useContracts";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { AberturaDeEmpresa } from "@/sections/contratos/tipos/abertura-empresa";
import { InvoicePdfDialog } from "@/sections/dashboard/invoice/invoice-pdf-dialog";
import Certificate01 from "@untitled-ui/icons-react/build/esm/Certificate01";

import { useState } from "react";

const statusColorsMap = {
  canceled: "error",
  paid: "success",
  pending: "warning",
};

export const ContractList = ({ id }) => {
  const { contracts } = useContractsByUserId(id, {});

  const [openPdf, setOpenPdf] = useState(false);

  const statusColor = statusColorsMap["canceled"];
  return (
    <Stack spacing={2}>
      <Typography color="text.secondary" variant="h6">
        Em aberto ({contracts.length})
      </Typography>
      <Card>
        <Scrollbar>
          <Table sx={{ minWidth: 600 }}>
            <TableBody>
              {contracts.map((contract, index) => {
                const serviceNames = contract.services
                  .map(({ name }) => name)
                  .join(", ");

                return (
                  <>
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell width="25%">
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                          sx={{
                            display: "inline-flex",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Avatar
                            sx={{
                              height: 42,
                              width: 42,
                            }}
                          >
                            <SvgIcon>
                              <Certificate01 />
                            </SvgIcon>
                          </Avatar>
                          <div>
                            <Typography
                              color="text.primary"
                              variant="subtitle2"
                            >
                              Contrato
                            </Typography>
                            <Typography color="text.secondary" variant="body2">
                              {serviceNames}
                            </Typography>
                          </div>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">Criação</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {contract.createdAt}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">Atualização</Typography>

                        <Typography color="text.secondary" variant="body2">
                          {contract.updatedAt}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <SeverityPill color={statusColor}>
                          {contract.completed ? "Concluido" : "Pendente"}
                        </SeverityPill>
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                          justifyContent="flex-end"
                        >
                          <Button
                            color="inherit"
                            onClick={() => setOpenPdf(true)}
                          >
                            Visualizar
                          </Button>
                          <PDFDownloadLink
                            document={<AberturaDeEmpresa contract={contract} />}
                            fileName={`contrato:${contract.number} - ${serviceNames}`}
                            style={{ textDecoration: "none" }}
                          >
                            <Button color="primary" variant="contained">
                              Baixar
                            </Button>
                          </PDFDownloadLink>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <InvoicePdfDialog
                      contract={contract}
                      onClose={() => setOpenPdf(false)}
                      open={openPdf}
                    />
                  </>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
      </Card>
    </Stack>
  );
};
