import { Fragment, useCallback, useState } from "react";
import PropTypes from "prop-types";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/ChevronDown";
import ChevronRightIcon from "@untitled-ui/icons-react/build/esm/ChevronRight";
import DotsHorizontalIcon from "@untitled-ui/icons-react/build/esm/Edit01";
import {
  Box,
  CardContent,
  Divider,
  Grid,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "../../../components/scrollbar";
import { SeverityPill } from "../../../components/severity-pill";
import { useAuth } from "../../../hooks/use-auth";
import { useRouter } from "next/router";
import { maskProcess } from "../../../utils/masks/mask-process";

export const ProcessListTable = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    products,
    productsCount,
    rowsPerPage,
    ...other
  } = props;
  const [currentProduct, setCurrentProduct] = useState(null);
  const router = useRouter();
  const { getTenant } = useAuth();
  const gt = getTenant();

  const handleProductToggle = useCallback((productId) => {
    setCurrentProduct((prevProductId) => {
      if (prevProductId === productId) {
        return null;
      }

      return productId;
    });
  }, []);

  const handleEdit = (id) => {
    router.push(`/clientes/${id}`);
  };

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Status</TableCell>
              <TableCell>Processo</TableCell>
              <TableCell>Classe</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Réu</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((process) => {
              let statusColor;
              let statusLabel;

              if (process.status === "archived") {
                statusColor = "info";
                statusLabel = "Arquivado";
              } else if (process.status === "progress") {
                statusColor = "success";
                statusLabel = "Andamento";
              } else if (process.status === "suspended") {
                statusColor = "warning";
                statusLabel = "Suspenso";
              }

              {
                process.division;
              }

              const isCurrent = process.id === currentProduct;

              return (
                <Fragment key={process.id}>
                  <TableRow hover key={process.id}>
                    <TableCell
                      padding="checkbox"
                      sx={{
                        ...(isCurrent && {
                          position: "relative",
                          "&:after": {
                            position: "absolute",
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: "primary.main",
                            width: 3,
                            height: "calc(100% + 1px)",
                          },
                        }),
                      }}
                      width="25%"
                    >
                      <IconButton
                        onClick={() => handleProductToggle(process.id)}
                      >
                        <SvgIcon>
                          {isCurrent ? (
                            <ChevronDownIcon />
                          ) : (
                            <ChevronRightIcon />
                          )}
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={statusColor}>
                        {statusLabel}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>{maskProcess(process.number)}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Box
                          sx={{
                            cursor: "pointer",
                            ml: 2,
                          }}
                        >
                          <Typography variant="subtitle2">
                            {process.class}
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            {process.division}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{process.exeqte}</TableCell>

                    <TableCell> {process.exectdo}</TableCell>

                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleEdit(process.customerId)}
                      >
                        <SvgIcon>
                          <DotsHorizontalIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {isCurrent && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{
                          p: 0,
                          position: "relative",
                          "&:after": {
                            position: "absolute",
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: "primary.main",
                            width: 3,
                            height: "calc(100% + 1px)",
                          },
                        }}
                      >
                        <CardContent>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Typography variant="h6">
                                Detalhes do processo
                              </Typography>
                              <Divider sx={{ my: 2 }} />
                              <Grid container spacing={3}>
                                <Grid item xs={12}>
                                  <Typography variant="body2">
                                    {process.extra ?? "Nada a ser exibido..."}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={productsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

ProcessListTable.propTypes = {
  products: PropTypes.array.isRequired,
  productsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
