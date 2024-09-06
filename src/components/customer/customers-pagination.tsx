'use client';

import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';

function noop(): void {
  return undefined;
}

interface CustomersPaginationProps {
  count: number;
  page: number;
}

export function CustomersPagination({ count, page }: CustomersPaginationProps): React.JSX.Element {
  return (
    <TablePagination
      component="div"
      count={count}
      labelDisplayedRows={({ from, to, count: total }) => `${from}–${to} de ${total}`}
      labelRowsPerPage="Linhas por página:"
      onPageChange={noop}
      onRowsPerPageChange={noop}
      page={page}
      rowsPerPage={5}
      rowsPerPageOptions={[5, 10, 25]}
    />
  );
}
