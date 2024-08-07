import { useCallback, useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  IconButton,
  Link,
  Stack,
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
import { phoneMask } from "../../../utils/masks/phoneMask";
import { maskDocument } from "../../../utils/masks/maskDocument";
import { useAuth } from "../../../hooks/use-auth";

const useSelectionModel = (customers) => {
  const customerIds = useMemo(() => {
    return customers.map((customer) => customer.id);
  }, [customers]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
  }, [customerIds]);

  const selectOne = useCallback((customerId) => {
    setSelected((prevState) => [...prevState, customerId]);
  }, []);

  const deselectOne = useCallback((customerId) => {
    setSelected((prevState) => {
      return prevState.filter((id) => id !== customerId);
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected([...customerIds]);
  }, [customerIds]);

  const deselectAll = useCallback(() => {
    setSelected([]);
  }, []);

  return {
    deselectAll,
    deselectOne,
    selectAll,
    selectOne,
    selected,
  };
};

export const CustomerListTable = (props) => {
  const {
    customers,
    customersCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...other
  } = props;
  const { deselectAll, selectAll, deselectOne, selectOne, selected } =
    useSelectionModel(customers);
  const { getTenant } = useAuth();
  const gt = getTenant();
  const handleToggleAll = useCallback(
    (event) => {
      const { checked } = event.target;

      if (checked) {
        selectAll();
      } else {
        deselectAll();
      }
    },
    [selectAll, deselectAll]
  );

  const selectedAll = selected.length === customers.length;
  const selectedSome =
    selected.length > 0 && selected.length < customers.length;
  const enableBulkActions = selected.length > 0;

  return (
    <Box sx={{ position: "relative" }} {...other}>
      {enableBulkActions && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "neutral.800" : "neutral.50",
            display: enableBulkActions ? "flex" : "none",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            px: 2,
            py: 0.5,
            zIndex: 10,
          }}
        >
          <Checkbox
            checked={selectedAll}
            indeterminate={selectedSome}
            onChange={handleToggleAll}
          />
        </Stack>
      )}
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleToggleAll}
                />
              </TableCell>
              <TableCell>Nome completo</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => {
              const business = customer?.business;
              const isBusiness = Boolean(business);

              const name = isBusiness
                ? business?.corporateName
                : customer?.name;
              const document = isBusiness
                ? business?.document
                : customer?.document;

                const email = isBusiness
                ? business?.email
                : customer?.email;


                const phone = isBusiness
                ? business?.phone
                : customer?.phone;

              const hasDevTeste = name?.includes("DEV");
              const clearName = hasDevTeste
                ? name.replace("TESTE DEV -", "")
                : name;

              const isSelected = selected.includes(customer.id);

              const chip = hasDevTeste ? (
                <Chip color="info" size="small" label="DEV" />
              ) : null;

              return (
                <TableRow hover key={customer.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        const { checked } = event.target;

                        if (checked) {
                          selectOne(customer.id);
                        } else {
                          deselectOne(customer.id);
                        }
                      }}
                      value={isSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <div>
                        <Link
                          color="inherit"
                          component={NextLink}
                          href={`/${gt}/clientes/${customer.id}`}
                          variant="subtitle2"
                        >
                          {chip}
                          {clearName}
                        </Link>
                        <Typography color="text.secondary" variant="body2">
                          {email}
                        </Typography>
                      </div>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {maskDocument(document)}
                    </Typography>
                  </TableCell>
                  <TableCell>{phoneMask(phone) ?? "--"}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={NextLink}
                      href={`/${gt}/clientes/${customer.id}/editar`}
                    >
                      <SvgIcon>
                        <Edit02Icon />
                      </SvgIcon>
                    </IconButton>
                    <IconButton
                      component={NextLink}
                      href={`/${gt}/clientes/${customer.id}`}
                    >
                      <SvgIcon>
                        <ArrowRightIcon />
                      </SvgIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={customersCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
      />
    </Box>
  );
};
