import { useCallback, useMemo, useRef, useState } from "react";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import {
  Box,
  Chip,
  Divider,
  Input,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { MultiSelect } from "../core/multi-select";
import { useUpdateEffect } from "@/hooks/use-update-effect";

interface ChipType {
  label: string;
  field: string;
  value: string;
  displayValue?: string;
}

interface Filters {
  name?: string;
  category: string[];
  status: string[];
  inStock?: boolean;
}

interface ProductListSearchProps {
  onFiltersChange?: (filters: Filters) => void;
}

const statusOptions = [
  {
    label: "Andamento",
    value: "progress",
  },
  {
    label: "Suspenso",
    value: "suspended",
  },
  {
    label: "Arquivado",
    value: "archived",
  },
];

export const JuridicoBusca: React.FC<ProductListSearchProps> = ({
  onFiltersChange,
  ...other
}) => {
  const queryRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>("");
  const [chips, setChips] = useState<ChipType[]>([]);

  const handleChipsUpdate = useCallback(() => {
    const filters: Filters = {
      name: undefined,
      category: [],
      status: [],
      inStock: undefined,
    };

    chips.forEach((chip) => {
      switch (chip.field) {
        case "name":
          filters.name = chip.value;
          break;
        case "category":
          filters.category.push(chip.value);
          break;
        case "status":
          filters.status.push(chip.value);
          break;
        case "inStock":
          filters.inStock = chip.value === "available";
          break;
        default:
          break;
      }
    });

    onFiltersChange?.(filters);
  }, [chips, onFiltersChange]);

  useUpdateEffect(() => {
    handleChipsUpdate();
  }, [chips, handleChipsUpdate]);

  const handleChipDelete = useCallback((deletedChip: ChipType) => {
    setChips((prevChips) => {
      return prevChips.filter(
        (chip) =>
          !(deletedChip.field === chip.field && deletedChip.value === chip.value)
      );
    });
  }, []);

  const handleQueryChange = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    setQuery(queryRef.current?.value || "");
  }, []);

//   const handleCategoryChange = useCallback((values: string[]) => {
//     setChips((prevChips: any) => {
//       const valuesFound: string[] = [];

//       const newChips = prevChips.filter((chip) => {
//         if (chip.field !== "category") {
//           return true;
//         }

//         const found = values.includes(chip.value);
//         if (found) {
//           valuesFound.push(chip.value);
//         }

//         return found;
//       });

//       if (values.length === valuesFound.length) {
//         return newChips;
//       }

//       values.forEach((value) => {
//         if (!valuesFound.includes(value)) {
//           const option = categoryOptions.find(
//             (option: any) => option.value === value
//           );
//           if (option) {
//             newChips.push({
//               label: "Category",
//               field: "category",
//               value,
//               displayValue: option.label,
//             });
//           }
//         }
//       });

//       return newChips;
//     });
//   }, []);

  const handleStatusChange = useCallback((values: string[]) => {
    setChips((prevChips) => {
      const valuesFound: string[] = [];

      const newChips = prevChips.filter((chip) => {
        if (chip.field !== "status") {
          return true;
        }

        const found = values.includes(chip.value);
        if (found) {
          valuesFound.push(chip.value);
        }

        return found;
      });

      if (values.length === valuesFound.length) {
        return newChips;
      }

      values.forEach((value) => {
        if (!valuesFound.includes(value)) {
          const option = statusOptions.find((option) => option.value === value);
          if (option) {
            newChips.push({
              label: "Status",
              field: "status",
              value,
              displayValue: option.label,
            });
          }
        }
      });

      return newChips;
    });
  }, []);

  const handleStockChange = useCallback((values: string[]) => {
    setChips((prevChips) => {
      const newChips = prevChips.filter((chip) => chip.field !== "inStock");
      const latestValue = values[values.length - 1];

      switch (latestValue) {
        case "available":
          newChips.push({
            label: "Stock",
            field: "inStock",
            value: "available",
            displayValue: "Available",
          });
          break;
        case "outOfStock":
          newChips.push({
            label: "Stock",
            field: "inStock",
            value: "outOfStock",
            displayValue: "Out of Stock",
          });
          break;
        default:
          break;
      }

      return newChips;
    });
  }, []);

  const categoryValues = useMemo(
    () =>
      chips
        .filter((chip) => chip.field === "category")
        .map((chip) => chip.value),
    [chips]
  );

  const statusValues = useMemo(
    () =>
      chips.filter((chip) => chip.field === "status").map((chip) => chip.value),
    [chips]
  );

  const stockValues = useMemo(() => {
    const values = chips
      .filter((chip) => chip.field === "inStock")
      .map((chip) => chip.value);

    if (values.length === 0) {
      values.unshift("all");
    }

    return values;
  }, [chips]);

  const showChips = chips.length > 0;

  return (
    <div {...other}>
      <Stack
        alignItems="center"
        component="form"
        direction="row"
        onSubmit={handleQueryChange}
        spacing={2}
        sx={{ p: 2 }}
      >
        <SvgIcon>
          <SearchMdIcon />
        </SvgIcon>
        <Input
          disableUnderline
          fullWidth
          inputProps={{ ref: queryRef }}
          placeholder="Buscar processo"
          sx={{ flexGrow: 1 }}
          value={query}
        />
      </Stack>
      <Divider />
      {showChips ? (
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          gap={1}
          sx={{ p: 2 }}
        >
          {chips.map((chip, index) => (
            <Chip
              key={index}
              label={
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    "& span": {
                      fontWeight: 600,
                    },
                  }}
                >
                  <>
                    <span>{chip.label}</span>: {chip.displayValue || chip.value}
                  </>
                </Box>
              }
              onDelete={() => handleChipDelete(chip)}
              variant="outlined"
            />
          ))}
        </Stack>
      ) : (
        <Box sx={{ p: 2.5 }}>
          <Typography color="text.secondary" variant="subtitle2">
            Sem filtros aplicados
          </Typography>
        </Box>
      )}
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        spacing={1}
        sx={{ p: 1 }}
      >
        <MultiSelect
          label="Status"
          onChange={handleStatusChange}
          options={statusOptions}
          value={statusValues}
        />
      </Stack>
    </div>
  );
};
