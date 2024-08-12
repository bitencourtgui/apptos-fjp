import { useCallback, useRef, useState } from "react";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import {
  Box,
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
} from "@mui/material";
import { useUpdateEffect } from "@/hooks/use-update-effect";

type CustomerListSearchProps = {
  onFiltersChange?: (filters: { query?: string }) => void;
};

export const CustomerListSearch: React.FC<CustomerListSearchProps> = ({
  onFiltersChange,
}) => {
  const queryRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState<{ query?: string }>({});

  const handleFiltersUpdate = useCallback(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  useUpdateEffect(() => {
    handleFiltersUpdate();
  }, [filters]);

  const handleQueryChange = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFilters((prevState) => ({
        ...prevState,
        query: queryRef.current?.value,
      }));
    },
    []
  );

  return (
    <Stack
      alignItems="center"
      direction="row"
      flexWrap="wrap"
      spacing={3}
      sx={{ p: 3 }}
    >
      <Box component="form" onSubmit={handleQueryChange} sx={{ flexGrow: 1 }}>
        <OutlinedInput
          defaultValue=""
          fullWidth
          inputRef={queryRef}
          placeholder="Buscar clientes"
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon>
                <SearchMdIcon />
              </SvgIcon>
            </InputAdornment>
          }
        />
      </Box>
    </Stack>
  );
};
