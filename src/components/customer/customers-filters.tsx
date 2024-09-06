'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { FilterButton, FilterPopover, useFilterContext } from '@/components/core/filter-button';

import { useCustomersSelection } from './customers-selection-context';

// const tabs = [
//   { label: 'Todos', value: '', count: 5 },
//   { label: 'Pessoa Juridica', value: 'active', count: 3 },
//   { label: 'Pessoa Fisica', value: 'pending', count: 1 },
// ] as const;

export interface Filters {
  email?: string;
  name?: string;
  status?: string;
  document?: string;
}

export type SortDir = 'asc' | 'desc';

export interface CustomersFiltersProps {
  filters?: Filters;
  sortDir?: SortDir;
}

export function CustomersFilters({ filters = {}, sortDir = 'desc' }: CustomersFiltersProps): React.JSX.Element {
  const { email, name, document } = filters;

  const router = useRouter();

  const selection = useCustomersSelection();

  const updateSearchParams = React.useCallback(
    (newFilters: Filters, newSortDir: SortDir): void => {
      const searchParams = new URLSearchParams();

      if (newSortDir === 'asc') {
        searchParams.set('sortDir', newSortDir);
      }

      if (newFilters.email) {
        searchParams.set('email', newFilters.email);
      }

      if (newFilters.name) {
        searchParams.set('name', newFilters.name);
      }

      if (newFilters.document) {
        searchParams.set('document', newFilters.document);
      }

      router.push(`clientes?${searchParams.toString()}`);
    },
    [router]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({}, sortDir);
  }, [updateSearchParams, sortDir]);

  // const handleStatusChange = React.useCallback(
  //   (_: React.SyntheticEvent, value: string) => {
  //     updateSearchParams({ ...filters, status: value }, sortDir);
  //   },
  //   [updateSearchParams, filters, sortDir]
  // );

  const handleEmailChange = React.useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, email: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleNameChange = React.useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, name: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleDocumentChange = React.useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, document: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  // const handleSortChange = React.useCallback(
  //   (event: SelectChangeEvent) => {
  //     updateSearchParams(filters, event.target.value as SortDir);
  //   },
  //   [updateSearchParams, filters]
  // );

  const hasFilters = document || email || name;

  return (
    <div>
      {/* <Tabs onChange={handleStatusChange} sx={{ px: 3 }} value={status ?? ''} variant="scrollable">
        {tabs.map((tab) => (
          <Tab
            icon={<Chip label={tab.count} size="small" variant="soft" />}
            iconPosition="end"
            key={tab.value}
            label={tab.label}
            sx={{ minHeight: 'auto' }}
            tabIndex={0}
            value={tab.value}
          />
        ))}
      </Tabs>
      <Divider /> */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', px: 3, py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          <FilterButton
            displayValue={name}
            label="Nome"
            onFilterApply={(value) => {
              handleNameChange(value as string);
            }}
            onFilterDelete={() => {
              handleNameChange();
            }}
            popover={<NameFilterPopover />}
            value={name}
          />

          <FilterButton
            displayValue={document}
            label="CPF/CNPJ"
            onFilterApply={(value) => {
              handleDocumentChange(value as string);
            }}
            onFilterDelete={() => {
              handleDocumentChange();
            }}
            popover={<DocumentFilterPopover />}
            value={document}
          />
          <FilterButton
            displayValue={email}
            label="E-mail"
            onFilterApply={(value) => {
              handleEmailChange(value as string);
            }}
            onFilterDelete={() => {
              handleEmailChange();
            }}
            popover={<EmailFilterPopover />}
            value={email}
          />

          {hasFilters ? <Button onClick={handleClearFilters}>Limpar filtros</Button> : null}
        </Stack>
        {selection.selectedAny ? (
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              {selection.selected.size} selecionados
            </Typography>
            <Button color="error" variant="contained">
              Deletar
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </div>
  );
}

function EmailFilterPopover(): React.JSX.Element {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    setValue((initialValue as string | undefined) ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filtrar por e-mail">
      <FormControl>
        <OutlinedInput
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              onApply(value);
            }
          }}
          value={value}
        />
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        Buscar
      </Button>
    </FilterPopover>
  );
}

function NameFilterPopover(): React.JSX.Element {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    setValue((initialValue as string | undefined) ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Buscar pelo Nome">
      <FormControl>
        <OutlinedInput
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              onApply(value);
            }
          }}
          value={value}
        />
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        Buscar
      </Button>
    </FilterPopover>
  );
}

function DocumentFilterPopover(): React.JSX.Element {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    setValue((initialValue as string | undefined) ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Buscar pelo CNPJ/CPF">
      <FormControl>
        <OutlinedInput
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              onApply(value);
            }
          }}
          value={value}
        />
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        Buscar
      </Button>
    </FilterPopover>
  );
}
