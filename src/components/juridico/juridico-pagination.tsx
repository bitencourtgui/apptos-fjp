'use client';

import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';

interface JuridicoPaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function JuridicoPagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: JuridicoPaginationProps): React.JSX.Element {
  return (
    <TablePagination
      component="div"
      count={count}
      labelDisplayedRows={({ from, to, count: total }) => `${from}–${to} de ${total}`}
      labelRowsPerPage="Linhas por página:"
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[5, 10, 25]}
    />
  );
}
