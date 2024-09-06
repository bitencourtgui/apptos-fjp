'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { maskDocument } from '@/utils/mask-document';
import { maskPhone } from '@/utils/mask-phone';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';

import { paths } from '@/paths';

import { useCustomersSelection } from './customers-selection-context';
import { ColumnDef, DataTable } from '../core/data-table';

export interface Customer {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone?: string;
  quota: number;
  status: 'pending' | 'active' | 'blocked';
  createdAt: Date;
  business?: {
    corporateName: string;
    document: string;
    email: string;
    phone?: string;
  };
  document?: string;
}

const columns = [
  {
    formatter: (row: Customer): React.JSX.Element => {
      const isBusiness = row?.business?.corporateName !== '';
      const dataName = isBusiness ? row?.business?.corporateName : row?.name;
      const dataEmail = isBusiness ? row?.business?.email : row?.email;

      return (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <div>
            <Link
              color="inherit"
              component={RouterLink}
              href={paths.dashboard.customers.details(row.id)}
              sx={{ whiteSpace: 'nowrap' }}
              variant="subtitle2"
            >
              {dataName}
            </Link>
            <Typography color="text.secondary" variant="body2">
              {dataEmail}
            </Typography>
          </div>
        </Stack>
      );
    },
    name: 'Nome completo',
    width: '250px',
  },
  {
    formatter: (row: Customer): React.JSX.Element => {
      const isBusiness = row?.business?.corporateName !== '';
      const dataDocument = isBusiness ? row?.business?.document : row?.document;

      return (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="body2">{maskDocument(dataDocument)}</Typography>
        </Stack>
      );
    },
    name: 'Documento',
    width: '250px',
  },
  {
    formatter: (row: Customer): React.JSX.Element => {
      const isBusiness = row?.business?.corporateName !== '';
      const dataPhone = isBusiness ? row?.business?.phone : row?.phone;

      return <Typography variant="body2">{maskPhone(dataPhone) ?? 'N/A'}</Typography>;
    },
    name: 'Telefone',
    width: '150px',
  },
  {
    formatter: (row): React.JSX.Element => (
      <IconButton component={RouterLink} href={paths.dashboard.customers.details(row.id)}>
        <PencilSimpleIcon />
      </IconButton>
    ),
    name: 'Actions',
    hideName: true,
    width: '100px',
    align: 'right',
  },
] satisfies ColumnDef<Customer>[];

export interface CustomersTableProps {
  rows: Customer[];
}

export function CustomersTable({ rows }: CustomersTableProps): React.JSX.Element {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useCustomersSelection();

  return (
    <React.Fragment>
      <DataTable<Customer>
        columns={columns}
        onDeselectAll={deselectAll}
        onDeselectOne={(_, row) => {
          deselectOne(row.id);
        }}
        onSelectAll={selectAll}
        onSelectOne={(_, row) => {
          selectOne(row.id);
        }}
        rows={rows}
        selectable
        selected={selected}
      />
      {!rows.length ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            Nenhum cliente encontrado
          </Typography>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
