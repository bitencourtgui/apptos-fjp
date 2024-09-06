"use client";

import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useCallback, Fragment } from "react";
import ChevronDown from "@untitled-ui/icons-react/build/esm/ChevronDown";
import Plus from "@untitled-ui/icons-react/build/esm/Plus";

import dayjs from "dayjs";
import Hash02 from "@untitled-ui/icons-react/build/esm/Hash02";

import { v4 as uuidv4 } from "uuid";
import { useCustomerById } from "@/hooks/use-customers";
import {
  OriginalPayload,
  transformContractPayload,
} from "@/transforms/contract";
import { useContract } from "@/hooks/use-contracts";

export const ServicesList: React.FC<{ id: string }> = ({ id }) => {
  const { customers, reload } = useCustomerById(id);
  const [open, setOpen] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<number | false>(
    false,
  );
  const [isGrouping, setIsGrouping] = useState(false);
  const [selectedServices, setSelectedServices] = useState<any>([]);

  const contractId = uuidv4();
  const { createContract } = useContract(contractId);

  const toggleAccordion = (index: number) =>
    setExpandedAccordion((prev) => (prev === index ? false : index));
  const toggleModal = () => setOpen((prev) => !prev);

  const toggleGrouping = () => {
    setIsGrouping((prev) => !prev);
    setSelectedServices([]);
  };

  const handleSelectService = (service: any) => {
    setSelectedServices((prev: any) =>
      prev.some((selectedService: any) => selectedService.id === service.id)
        ? prev.filter(
            (selectedService: any) => selectedService.id !== service.id,
          )
        : [...prev, service],
    );
  };

  const groupSelectedServices = () => {
    const payload = {
      ...useCustomerById,
      services: selectedServices,
    };

    const transformedPayload = transformContractPayload(
      payload as OriginalPayload,
    );

    handleGenerateContract(transformedPayload);
    setIsGrouping(false);
  };

  const handleGenerateContract = async (payload: any) => {
    const response = await createContract(payload);

    if (response.status === 200) {
      console.info("Contrato gerado e salvo com sucesso");
    } else {
      console.error("Erro ao salvar o contrato");
    }
  };
  const deleteInstallments = async (paymentId: string) => {
    const updatedServices = customers.services.filter(
      (service: any) => service.id !== paymentId,
    );

    const payload = { ...customers, services: updatedServices };

    // try {
    //   const response = await CustomersApi.updateCustomer(customers.id, payload);
    //   if (response.status === 200) {
    //     toast.success("Movimentação excluída com sucesso");
    //     getCustomer();
    //   }
    // } catch (error) {
    //   console.error(`Erro ao excluir installments: ${error}`);
    // }
  };

  const formatCurrency = useCallback(
    (value: number) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value),
    [],
  );

  const calculateDueDate = useCallback(
    (
      createdAt: string,
      paymentDate: number,
      monthsToAdd: number,
      accountingDate?: string,
    ) => {
      let baseDate = accountingDate
        ? dayjs(accountingDate, "YYYY-MM-DD")
        : dayjs(createdAt, "DD/MM/YYYY");
      let dueDate = baseDate
        .add(monthsToAdd, "month")
        .set("date", paymentDate || baseDate.date());

      if (dayjs(createdAt, "DD/MM/YYYY").isAfter(dueDate)) {
        dueDate = dueDate.add(1, "month");
      }

      return dueDate.isValid() ? dueDate.format("DD/MM/YYYY") : "Data inválida";
    },
    [],
  );

  const formatPaymentDate = useCallback(
    (accountingDate: string, paymentDate: number, createdAt: string) =>
      accountingDate
        ? dayjs(accountingDate).format("DD/MM/YYYY")
        : `Dia ${paymentDate}` || createdAt,
    [],
  );

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" mb={2} spacing={2}>
        <Button size="small" onClick={toggleGrouping} variant="outlined">
          {isGrouping ? "Cancelar" : "Gerar Contrato"}
        </Button>
        {isGrouping && (
          <Button
            size="small"
            onClick={groupSelectedServices}
            variant="contained"
          >
            Confirmar
          </Button>
        )}
        <Button
          size="small"
          startIcon={<Plus fontSize="small" />}
          onClick={toggleModal}
          variant="contained"
        >
          Novo
        </Button>
      </Stack>
      <Card>
        <Table sx={{ minWidth: 600 }}>
          <TableBody>
            {customers?.services?.map((props: any, index: any) => (
              <Fragment key={id}>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell width="20%">
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={2}
                      sx={{ display: "inline-flex", whiteSpace: "nowrap" }}
                    >
                      <Avatar
                        sx={{ height: 42, width: 42, bgcolor: "#E5E7EB" }}
                      >
                        {isGrouping && props.serviceType !== "0" ? (
                          <Checkbox
                            checked={selectedServices.some(
                              (selectedService: any) =>
                                selectedService.id === props.id,
                            )}
                            onChange={() => handleSelectService(props)}
                          />
                        ) : (
                          <SvgIcon>
                            <Hash02 color="#212636" />
                          </SvgIcon>
                        )}
                      </Avatar>

                      <div>
                        <Typography color="text.primary" variant="subtitle2">
                          Serviço
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {
                            [
                              "Abertura de Empresa",
                              "Contabilidade Empresarial",
                              "Desenquadramento",
                            ][props.serviceType]
                          }
                        </Typography>
                      </div>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Mensalidade</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {props.cashPayment
                        ? "Pagamento à vista"
                        : `${
                            props.monthyFee
                              ? `${props.monthyFee}x`
                              : formatCurrency(props.accountingFee)
                          }`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      Data de Pagamento
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {formatPaymentDate(
                        props.accountingDate,
                        props.paymentDate,
                        props.createdAt,
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Valor</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {props.serviceType === "0" || props.serviceType === "2"
                        ? formatCurrency(props.openingContract)
                        : formatCurrency(props.accountingFee * 12)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <ChevronDown
                      style={{
                        transform:
                          expandedAccordion === index
                            ? "rotate(180deg)"
                            : "rotate(0)",
                        transition: "transform 0.3s ease",
                      }}
                      onClick={() => toggleAccordion(index)}
                    />
                  </TableCell>
                </TableRow>
                {expandedAccordion === index && (
                  <>
                    <TableRow selected>
                      <TableCell>Nº</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Vencimento</TableCell>
                      <TableCell width="25%" colSpan={2}>
                        Método de pagamento
                      </TableCell>
                    </TableRow>
                    {props.paymentEntry && (
                      <TableRow hover>
                        <TableCell>0</TableCell>
                        <TableCell>
                          {formatCurrency(Number(props.accountingPayment))}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell colSpan={2}>Entrada</TableCell>
                      </TableRow>
                    )}
                    {Array.from({
                      length: props.serviceType === "0" ? props.monthyFee : 12,
                    }).map((_, installmentIndex) => (
                      <TableRow hover key={installmentIndex}>
                        <TableCell>{installmentIndex + 1}</TableCell>
                        <TableCell>
                          {props.serviceType === "0"
                            ? formatCurrency(
                                (props.openingContract -
                                  Number(props.accountingPayment ?? 0)) /
                                  props.monthyFee,
                              )
                            : formatCurrency(props.accountingFee)}
                        </TableCell>
                        <TableCell>
                          {calculateDueDate(
                            props.createdAt,
                            props.paymentDate,
                            installmentIndex,
                            props.accountingDate,
                          )}
                        </TableCell>
                        <TableCell>
                          {props.paymentMethod === "creditcard"
                            ? "Cartão de crédito"
                            : "Boleto"}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                    <Button onClick={() => deleteInstallments(id)}>
                      Excluir movimentação
                    </Button>
                  </>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </Card>
      {/* <ServicesModal
        customers={customer}
        open={open}
        handleToggle={toggleModal}
        reload={getCustomer}
      /> */}
    </>
  );
};
