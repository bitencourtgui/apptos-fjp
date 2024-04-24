/* eslint-disable react-hooks/exhaustive-deps */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import PixIcon from "@mui/icons-material/Pix";
import PaidIcon from "@mui/icons-material/Paid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PixGenerator from "../../../utils/pix-generator";
import CopyToClipboard from "../../../components/copy-to-clipboard/copy-to-clipboard";
import { convertToISODate } from "../../../utils/convert-ISO-date";
import { formatCurrency } from "../../../utils/masks/currencyMask";
import { useMounted } from "../../../hooks/use-mounted";
import FinancialApi from "../../../api/financial";
import { Payment } from "./financial.types";
import toast from "react-hot-toast";
import PaymentModal from "./financial-modal";
import { Scrollbar } from "../../../components/scrollbar";
import EmptyTable from "../../../components/empty-table";

const useFinancial = (id: string) => {
  const isMounted = useMounted();
  const [financial, setFinancial] = useState(null);

  const getFinancial = useCallback(async () => {
    try {
      const response = await FinancialApi.getInvoices(id);

      if (isMounted()) {
        setFinancial(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getFinancial();
  }, []);

  return { financial, getFinancial };
};

export const FinancialList: React.FC<{ id: string }> = ({ id }) => {
  const { financial, getFinancial } = useFinancial(id);

  const itemsData: Payment[] = financial?.payments;

  const handlePayment = async (installmentId: string) => {
    try {
      const response = await FinancialApi.updateInvoiceStatus(
        id,
        installmentId
      );

      if (response.status === 200) {
        toast.success("Pagamento atualizado com sucesso");
        getFinancial();
      }
    } catch (erro) {
      toast.error("Falha ao cadastrar cliente");
    }
  };

  const handleStatus = (status: string, dueDate: string) => {
    const vencimentoParcela = new Date(convertToISODate(dueDate));
    const hojeMaisDoisDias = new Date();
    hojeMaisDoisDias.setDate(hojeMaisDoisDias.getDate() + 2);

    if (status === "Pago") {
      return (
        <Chip color="success" variant="filled" label={status} size="small" />
      );
    }

    if (status === "Pendente" && vencimentoParcela < hojeMaisDoisDias) {
      return (
        <Chip color="error" variant="filled" label="Vencida" size="small" />
      );
    }

    return (
      <Chip color="default" variant="filled" label={status} size="small" />
    );
  };

  const [open, setOpen] = React.useState(false);
  const handleToggle = (isOpen: boolean) => setOpen(isOpen);

  const handleDeleteInstallments = async (paymentId: string) => {
    try {
      const response = await FinancialApi.deleteInvoice(id, paymentId);

      if (response.status === 200) {
        toast.success("Movimentação excluida com sucesso");
        getFinancial();
      }
    } catch (erro) {
      toast.error("Falha ao excluir movimentação");
    }

    try {
      // await deletePayment(customerId, paymentId);
      // reload();
    } catch (error) {
      console.error(`Erro ao excluir installments: ${error}`);
    } finally {
      console.info("excluido com sucesso!!");
    }
  };

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Stack spacing={1}>
          <Button
            size="small"
            startIcon={<AddOutlinedIcon fontSize="small" />}
            onClick={() => handleToggle(true)}
            variant="contained"
          >
            Nova movimentação
          </Button>
        </Stack>
      </Stack>
      {itemsData ? (
        itemsData.map(({ id, installments }, index) => (
          <Card key={id} sx={{ margin: "16px 0" }}>
            <Scrollbar>
              <Box>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Grid display="flex" gap={8} m={2}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="left"
                        sx={{ width: "120px" }}
                      >
                        <Typography variant="caption">Valor total</Typography>

                        <Typography variant="h6">
                          {formatCurrency(
                            installments.reduce(
                              (acc, { installmentValue }) =>
                                acc + parseFloat(installmentValue),
                              0
                            )
                          )}
                        </Typography>
                      </Box>
                      <Divider orientation="vertical" />
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="left"
                        sx={{ width: "120px" }}
                      >
                        <Typography variant="caption">Mensalidade</Typography>

                        <Typography variant="h6">
                          {
                            installments[installments.length - 1]
                              .installmentNumber
                          }{" "}
                          Parcelas
                        </Typography>
                      </Box>
                      <Divider orientation="vertical" />
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="left"
                        sx={{ width: "120px" }}
                      >
                        <Typography variant="caption">
                          Próximo vencimento
                        </Typography>
                        <Typography variant="h6">
                          {installments.find(
                            (item) => item.installmentStatus === "Pendente"
                          )?.dueDate || "N/A"}
                        </Typography>
                      </Box>
                      <Divider orientation="vertical" />
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="left"
                      >
                        <Typography variant="caption">Honorários</Typography>

                        <Typography variant="h6">
                          {installments[installments.length - 1].fees} %
                        </Typography>
                      </Box>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nº</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Valor</TableCell>
                          <TableCell>Vencimento</TableCell>
                          <TableCell sx={{ width: "100px" }} align="center">
                            Pix
                          </TableCell>
                          <TableCell sx={{ width: "120px" }} align="center">
                            Baixar Parcela
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {installments.length === 0 ? (
                          <EmptyTable registry={installments} />
                        ) : (
                          installments.map(
                            ({
                              installmentsId,
                              installmentStatus,
                              installmentNumber,
                              installmentValue,
                              dueDate,
                            }) => {
                              const pixCode = PixGenerator({
                                key: "47956830000150",
                                name: "Flavia Almeida Advocacia",
                                city: "POA",
                                amount: parseFloat(installmentValue),
                                transactionId: installmentsId,
                              });

                              return (
                                <TableRow hover key={installmentNumber}>
                                  <TableCell>{installmentNumber}</TableCell>
                                  <TableCell>
                                    {handleStatus(installmentStatus, dueDate)}
                                  </TableCell>
                                  <TableCell>{`R$ ${installmentValue}`}</TableCell>
                                  <TableCell>{dueDate}</TableCell>
                                  <TableCell
                                    sx={{ width: "100px" }}
                                    align="center"
                                  >
                                    <CopyToClipboard
                                      icon={<PixIcon />}
                                      text={pixCode}
                                    />
                                  </TableCell>
                                  <TableCell
                                    sx={{ width: "120px" }}
                                    align="center"
                                  >
                                    <IconButton
                                      onClick={() =>
                                        handlePayment(installmentsId)
                                      }
                                    >
                                      <Tooltip
                                        title={
                                          installmentStatus === "Pago"
                                            ? "Mudar para Pendente"
                                            : "Mudar para Pago"
                                        }
                                      >
                                        {installmentStatus === "Pendente" ? (
                                          <PaidOutlinedIcon />
                                        ) : (
                                          <PaidIcon />
                                        )}
                                      </Tooltip>
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )
                        )}
                      </TableBody>
                    </Table>
                    {/* @TODO */}
                    {/* <TablePagination
                        component="div"
                        count={count}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={onRowsPerPageChange}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Linhas por página"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                      /> */}
                    <Box sx={{ textAlign: "end", marginTop: 1 }}>
                      <Button
                        onClick={() =>
                          handleDeleteInstallments(itemsData[index].id)
                        }
                      >
                        Excluir movimentação
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Scrollbar>
          </Card>
        ))
      ) : (
        <></>
      )}
      <PaymentModal
        open={open}
        handleToggle={handleToggle}
        customerId={id}
        edit={false}
        itemsData={itemsData}
        reload={getFinancial()}
      />
    </>
  );
};
