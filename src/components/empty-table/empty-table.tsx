import { CircularProgress, TableCell, TableRow } from "@mui/material";
import React from "react";

export const EmptyTable = ({ registry }) => {
  const Label = (): JSX.Element => {
    if (typeof registry === "undefined") {
      return <CircularProgress disableShrink />;
    } else {
      return <span>Nenhum registro encontrado</span>;
    }
  };

  return (
    <TableRow>
      <TableCell colSpan={6} align="center">
        <Label />
      </TableCell>
    </TableRow>
  );
};
