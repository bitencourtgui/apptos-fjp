"use client";

import {
  Avatar,
  Button,
  Card,
  Divider,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState, Fragment } from "react";
import ChevronDown from "@untitled-ui/icons-react/build/esm/ChevronDown";
import Plus from "@untitled-ui/icons-react/build/esm/Plus";
import Hash02 from "@untitled-ui/icons-react/build/esm/Hash02";

import { useRouter } from "next/navigation";
import { useProcessByCustomerId } from "@/hooks/use-processes";
import { maskProcess } from "@/utils/mask-process";
import { maskPhone } from "@/utils/mask-phone";

export const JuridicoList: React.FC<{ id: string; name: string }> = ({
  id,
  name,
}) => {
  const router = useRouter();

  const { processes } = useProcessByCustomerId(String(id));
  const [expandedAccordion, setExpandedAccordion] = useState<number | false>(
    false,
  );

  const toggleAccordion = (index: number) =>
    setExpandedAccordion((prev) => (prev === index ? false : index));

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" mb={2} spacing={2}>
        <Button
          size="small"
          startIcon={<Plus fontSize="small" />}
          onClick={() => router.push(`/juridico/adicionar?customerId=${id}`)}
          variant="contained"
        >
          Novo Processo
        </Button>
      </Stack>
      <Card>
        <Table sx={{ minWidth: 600 }}>
          <TableBody>
            {processes?.map((props: any, index: any) => {
              const opposing = props.exeqte.includes(name)
                ? props.exectdo
                : props.exectdo.includes(name)
                  ? props.exeqte
                  : props.exectdo;

              return (
                <Fragment key={id}>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell width="40%">
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                        sx={{ display: "inline-flex", whiteSpace: "nowrap" }}
                      >
                        <Avatar
                          sx={{ height: 42, width: 42, bgcolor: "#E5E7EB" }}
                        >
                          <SvgIcon>
                            <Hash02 color="#212636" />
                          </SvgIcon>
                        </Avatar>

                        <div>
                          <Typography color="text.primary" variant="subtitle2">
                            Processo
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            {maskProcess(props.number)}
                          </Typography>
                        </div>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        Parte Contrária
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {opposing}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">Assunto</Typography>
                      <Typography color="text.secondary" variant="body2">
                        {props.subject}
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
                    <TableRow selected>
                      <TableCell colSpan={4}>
                        <Stack direction="column" mx={4} my={3} gap={2.2}>
                          <Stack direction="row" gap={10}>
                            <div>
                              <Stack direction="row">
                                <Typography variant="body2">
                                  Processo
                                </Typography>
                              </Stack>
                              <Typography variant="subtitle2">
                                {maskProcess(props.number)}
                              </Typography>
                            </div>
                            <div>
                              <Stack direction="row">
                                <Typography variant="body2">Classe</Typography>
                              </Stack>
                              <Typography variant="subtitle2">
                                {props.subject !== "" ? props.subject : "--"}
                              </Typography>
                            </div>
                            <div>
                              <Stack direction="row">
                                <Typography variant="body2">Assunto</Typography>
                              </Stack>
                              <Typography variant="subtitle2">
                                {props.class !== "" ? props.class : "--"}
                              </Typography>
                            </div>
                          </Stack>
                          <Divider />
                          <Stack direction="row" gap={10}>
                            <div>
                              <Stack direction="row">
                                <Typography variant="body2">Autor</Typography>
                              </Stack>
                              <Typography variant="subtitle2">
                                {props.exeqte !== "" ? props.exeqte : "--"}
                              </Typography>
                            </div>
                            <div>
                              <Stack direction="row">
                                <Typography variant="body2">Réu</Typography>
                              </Stack>
                              <Typography variant="subtitle2">
                                {props.exectdo !== "" ? props.exectdo : "--"}
                              </Typography>
                            </div>
                          </Stack>
                          <Divider />
                          <Stack direction="row" gap={10}>
                            <div>
                              <Stack direction="row">
                                <Typography variant="body2">
                                  Tribunal
                                </Typography>
                              </Stack>
                              <Typography variant="subtitle2">
                                {props.tribunal !== "" ? props.tribunal : "--"}
                              </Typography>
                            </div>
                            <div>
                              <Stack direction="row">
                                <Typography variant="body2">Foro</Typography>
                              </Stack>
                              <Typography variant="subtitle2">
                                {props.court !== "" ? props.court : "--"}
                              </Typography>
                            </div>
                            <div>
                              <Stack direction="row">
                                <Typography variant="body2">Vara</Typography>
                              </Stack>
                              <Typography variant="subtitle2">
                                {props.division !== "" ? props.division : "--"}
                              </Typography>
                            </div>

                            <div>
                              <Stack direction="row">
                                <Typography variant="body2">
                                  E-mail da Vara
                                </Typography>
                              </Stack>
                              <Typography variant="subtitle2">
                                {props.divisionEmail !== ""
                                  ? props.divisionEmail
                                  : "--"}
                              </Typography>
                            </div>
                            <div>
                              <Stack direction="row">
                                <Typography variant="body2">
                                  Telefone da Vara
                                </Typography>
                              </Stack>
                              <Typography variant="subtitle2">
                                {props.divisionPhone !== ""
                                  ? maskPhone(props.divisionPhone)
                                  : "--"}
                              </Typography>
                            </div>
                          </Stack>
                          <Divider />
                          <Stack direction="row" gap={10}>
                            <div>
                              <Stack direction="row">
                                <Typography variant="body2">
                                  Observações
                                </Typography>
                              </Stack>
                              <Typography variant="subtitle2">
                                {props.extra !== "" ? props.extra : "--"}
                              </Typography>
                            </div>
                          </Stack>
                          <Divider />

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            gap={2}
                            mt={3}
                          >
                            <Button
                              variant="contained"
                              onClick={() =>
                                router.push(`/juridico/editar?id=${props.id}`)
                              }
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outlined"
                              // onClick={() => handleSubmit(props.id)}
                            >
                              Excluir
                            </Button>
                          </Stack>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Card>
      {/* <ServicesModal
        customers={customers}
        open={open}
        handleToggle={toggleModal}
        reload={reload}
      /> */}
    </>
  );
};
