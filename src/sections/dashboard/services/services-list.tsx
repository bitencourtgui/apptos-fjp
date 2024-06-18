/* eslint-disable react-hooks/exhaustive-deps */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useMounted } from "../../../hooks/use-mounted";
import { Scrollbar } from "../../../components/scrollbar";
import ServicesModal from "./modal";
import CustomersApi from "@/api/customers";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const useCustomer = (userId: string) => {
  const isMounted = useMounted();

  const [customer, setCustomer] = useState(null);

  const getCustomer = useCallback(async () => {
    try {
      const response = await CustomersApi.getCustomer(userId.toString());

      if (isMounted()) {
        setCustomer(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getCustomer();
  }, []);

  return { customer, getCustomer };
};

export const ServicesList: React.FC<{ id: string }> = ({ id }) => {
  const { customer, getCustomer } = useCustomer(id);

  const [open, setOpen] = React.useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleDeleteInstallments = async (paymentId: string) => {
    customer.services = customer.services.filter(
      (service) => service.id !== paymentId
    );

    const payload = {
      ...customer,
      services: customer.services,
    };

    try {
      const response = await CustomersApi.updateCustomer(customer.id, payload);

      if (response.status === 200) {
        toast.success("Movimentação excluida com sucesso");
        getCustomer();
      }
      // reload();
    } catch (error) {
      console.error(`Erro ao excluir installments: ${error}`);
    } finally {
      console.info("excluido com sucesso!!");
    }
  };

  const servicesList = ["Abertura de Empresa"];

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }
  const calculateDueDate = (
    createdAt: string,
    paymentDate: number,
    monthsToAdd: number
  ) => {
    const createdDate = dayjs(createdAt, "DD/MM/YYYY");
    let dueDate = createdDate.add(monthsToAdd, "month").date(paymentDate);

    if (createdDate.isAfter(dueDate)) {
      dueDate = dueDate.add(1, "month");
    }

    return dueDate.format("DD/MM/YYYY");
  };

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Stack spacing={1}>
          <Button
            size="small"
            startIcon={<AddOutlinedIcon fontSize="small" />}
            onClick={() => handleToggle()}
            variant="contained"
          >
            Nova movimentação
          </Button>
        </Stack>
      </Stack>
      {customer ? (
        customer?.services?.map(
          (
            {
              cashPayment,
              openingContract,
              paymentDate,
              serviceType,
              monthyFee,
              ...others
            },
            index
          ) => {
            console.log(
              cashPayment,
              openingContract,
              paymentDate,
              serviceType,
              others
            );

            return (
              <Card key={index} sx={{ margin: "16px 0" }}>
                <Scrollbar>
                  <Box>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Grid display="flex" gap={8} m={2}>
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="left"
                            sx={{ width: "180px" }}
                          >
                            <Typography variant="caption">Serviço</Typography>

                            <Typography variant="h6">
                              {servicesList[serviceType]}
                            </Typography>
                          </Box>
                          <Divider orientation="vertical" />
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="left"
                            sx={{ width: "180px" }}
                          >
                            <Typography variant="caption">
                              Mensalidade
                            </Typography>

                            <Typography variant="h6">
                              {cashPayment
                                ? "Pagamento a vista"
                                : `${monthyFee}x`}
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
                              Data de pagamento
                            </Typography>
                            <Typography variant="h6">
                              Dia {paymentDate}
                            </Typography>
                          </Box>
                          <Divider orientation="vertical" />
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="left"
                          >
                            <Typography variant="caption">Valor</Typography>

                            <Typography variant="h6">
                              {formatCurrency(openingContract)}
                            </Typography>
                          </Box>
                        </Grid>
                      </AccordionSummary>
                      {!cashPayment && (
                        <AccordionDetails>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Nº</TableCell>
                                <TableCell>Valor</TableCell>
                                <TableCell>Vencimento</TableCell>
                                <TableCell width="25%">
                                  Método de pagamento
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {[...Array(monthyFee)].map((_, index) => (
                                <TableRow hover key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>
                                    {formatCurrency(
                                      openingContract / monthyFee
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {calculateDueDate(
                                      others.createdAt,
                                      paymentDate,
                                      index + 1
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {others.paymentMethod === "creditcard"
                                      ? "Cartão de crédito"
                                      : "Boleto"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </AccordionDetails>
                      )}
                      <Box sx={{ textAlign: "end", mb: 2, mr: 2 }}>
                        <Button
                          onClick={() => handleDeleteInstallments(others.id)}
                        >
                          Excluir movimentação
                        </Button>
                      </Box>
                    </Accordion>
                  </Box>
                </Scrollbar>
              </Card>
            );
          }
        )
      ) : (
        <></>
      )}
      <ServicesModal
        open={open}
        handleToggle={handleToggle}
        customers={customer}
        reload={getCustomer}
      />
    </>
  );
};
