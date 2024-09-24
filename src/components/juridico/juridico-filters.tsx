"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  FilterButton,
  FilterPopover,
  useFilterContext,
} from "@/components/core/filter-button";
import { useJuridicoSelection } from "./juridico-selection-context";
import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

const statusOptions = [
  { label: "Andamento", value: "progress" },
  { label: "Suspenso", value: "suspended" },
  { label: "Arquivado", value: "archived" },
];

export interface Filters {
  status?: string;
  number?: string;
}

export type SortDir = "asc" | "desc";

export interface JuridicoFiltersProps {
  filters?: Filters;
  sortDir?: SortDir;
}

export function JuridicoFilters({
  filters = {},
  sortDir = "desc",
}: JuridicoFiltersProps): React.JSX.Element {
  const { status, number } = filters;

  const router = useRouter();

  const selection = useJuridicoSelection();

  const updateSearchParams = React.useCallback(
    (newFilters: Filters, newSortDir: SortDir): void => {
      const searchParams = new URLSearchParams();

      if (newSortDir === "asc") {
        searchParams.set("sortDir", newSortDir);
      }

      if (newFilters.status) {
        searchParams.set("status", newFilters.status);
      }

      if (newFilters.number) {
        searchParams.set("number", newFilters.number);
      }

      router.push(`juridico?${searchParams.toString()}`);
    },
    [router],
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({}, sortDir);
  }, [updateSearchParams, sortDir]);

  const handleStatusChange = React.useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, status: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir],
  );

  const handleDocumentChange = React.useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, number: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir],
  );

  const hasFilters = number || status;

  return (
    <div>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: "center", flexWrap: "wrap", px: 3, py: 2 }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center", flex: "1 1 auto", flexWrap: "wrap" }}
        >
          <FilterButton
            displayValue={status}
            label="Status"
            onFilterApply={(value) => {
              handleStatusChange(value as string);
            }}
            onFilterDelete={() => {
              handleStatusChange();
            }}
            popover={<StatusFilterPopover />}
            value={status}
          />

          <FilterButton
            displayValue={number}
            label="Processo"
            onFilterApply={(value) => {
              handleDocumentChange(value as string);
            }}
            onFilterDelete={() => {
              handleDocumentChange();
            }}
            popover={<NumberFilterPopover />}
            value={number}
          />

          {hasFilters ? (
            <Button onClick={handleClearFilters}>Limpar filtros</Button>
          ) : null}
        </Stack>
        {selection.selectedAny ? (
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
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

function StatusFilterPopover(): React.JSX.Element {
  const {
    anchorEl,
    onApply,
    onClose,
    open,
    value: initialValue,
  } = useFilterContext();
  const [value, setValue] = React.useState<string>("");

  React.useEffect(() => {
    setValue((initialValue as string | undefined) ?? "");
  }, [initialValue]);

  // Alterado para usar SelectChangeEvent
  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setValue(event.target.value);
  };

  return (
    <FilterPopover
      anchorEl={anchorEl}
      onClose={onClose}
      open={open}
      title="Filtrar por Status"
    >
      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select value={value} onChange={handleStatusChange} label="Status">
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={() => onApply(value)} variant="contained" sx={{ mt: 2 }}>
        Aplicar Filtro
      </Button>
    </FilterPopover>
  );
}

function NumberFilterPopover(): React.JSX.Element {
  const {
    anchorEl,
    onApply,
    onClose,
    open,
    value: initialValue,
  } = useFilterContext();
  const [value, setValue] = React.useState<string>("");

  React.useEffect(() => {
    setValue((initialValue as string | undefined) ?? "");
  }, [initialValue]);

  const removePunctuation = (input: string) => {
    return input.replace(/[^\w\s]/gi, "");
  };

  return (
    <FilterPopover
      anchorEl={anchorEl}
      onClose={onClose}
      open={open}
      title="Buscar pelo Número do processo"
    >
      <FormControl>
        <OutlinedInput
          onChange={(event) => {
            const cleanValue = removePunctuation(event.target.value);
            setValue(cleanValue);
          }}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
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
