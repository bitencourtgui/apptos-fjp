"use client";

import * as React from "react";
import { maskProcess } from "@/utils/mask-process";
import { Box, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { ColumnDef, DataTable } from "../core/data-table";
import { SeverityPill } from "../core/severity-pill";

import { PencilSimple as PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { ListPlus as ListPlusIcon } from "@phosphor-icons/react/dist/ssr/ListPlus";
import { CaretRight as CaretRightIcon } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { CaretDown as CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";

export interface IProcess {
  id: string;
  status: "archived" | "progress" | "suspended";
  number: string;
  class: string;
  division: string;
  exeqte: string;
  exectdo: string;
  customerId: string;
  extra?: string;
  tribunal: string;
}

export interface ProcessListTableProps {
  rows: IProcess[];
  onOpenDrawer: (process: IProcess) => void;
}

export function ProcessListTable({
  rows,
  onOpenDrawer,
}: ProcessListTableProps): React.JSX.Element {
  const [currentProduct, setCurrentProduct] = React.useState<string | null>(
    null,
  );
  const router = useRouter();

  const handleProductToggle = React.useCallback((productId: string) => {
    setCurrentProduct((prevProductId) =>
      prevProductId === productId ? null : productId,
    );
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/clientes/${id}`);
  };

  const columns = [
    {
      formatter: (row: IProcess): React.JSX.Element => {
        const isCurrent = row.id === currentProduct;
        return (
          <IconButton onClick={() => handleProductToggle(row.id)}>
            {isCurrent ? <CaretDownIcon /> : <CaretRightIcon />}
          </IconButton>
        );
      },
      name: "",
      width: "50px",
      hideName: true,
    },
    {
      formatter: (row: IProcess): React.JSX.Element => {
        let statusColor: "info" | "success" | "warning" = "info";
        let statusLabel = "";

        switch (row.status) {
          case "archived":
            statusColor = "info";
            statusLabel = "Arquivado";
            break;
          case "progress":
            statusColor = "success";
            statusLabel = "Andamento";
            break;
          case "suspended":
            statusColor = "warning";
            statusLabel = "Suspenso";
            break;
        }

        return <SeverityPill color={statusColor}>{statusLabel}</SeverityPill>;
      },
      name: "Status",
      width: "150px",
    },
    {
      formatter: (row: IProcess): React.JSX.Element => (
        <Typography variant="body2">{maskProcess(row.number)}</Typography>
      ),
      name: "Processo",
      width: "150px",
    },
    {
      formatter: (row: IProcess): React.JSX.Element => (
        <Box>
          <Typography variant="subtitle2">{row.class}</Typography>
          <Typography color="text.secondary" variant="body2">
            {row.division}
          </Typography>
        </Box>
      ),
      name: "Classe",
      width: "200px",
    },
    {
      formatter: (row: IProcess): React.JSX.Element => (
        <Typography variant="body2">{row.exeqte}</Typography>
      ),
      name: "Autor",
      width: "150px",
    },
    {
      formatter: (row: IProcess): React.JSX.Element => (
        <Typography variant="body2">{row.exectdo}</Typography>
      ),
      name: "Réu",
      width: "150px",
    },
    {
      formatter: (row: IProcess): React.JSX.Element => (
        <>
          <IconButton onClick={() => handleEdit(row.customerId)}>
            <PencilSimpleIcon />
          </IconButton>
          <IconButton onClick={() => onOpenDrawer(row)}>
            {" "}
            {/* Use 'row' instead of 'process' */}
            <ListPlusIcon />
          </IconButton>
        </>
      ),
      name: "Actions",
      width: "100px",
      align: "right",
      hideName: true,
    },
  ] satisfies ColumnDef<IProcess>[];

  return (
    <React.Fragment>
      <DataTable<IProcess> columns={columns} rows={rows} selectable={false} />
      {!rows.length ? (
        <Box sx={{ p: 3 }}>
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center" }}
            variant="body2"
          >
            Nenhum processo encontrado
          </Typography>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
