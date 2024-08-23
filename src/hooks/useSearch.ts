import { useState } from "react";

// Define a interface para o estado de pesquisa
interface SearchFilters {
  query?: string;
  hasAcceptedMarketing?: boolean;
  isProspect?: boolean;
  isReturning?: boolean;
}

interface SearchState {
  filters: SearchFilters;
  page: number;
  rowsPerPage: number;
  sortBy: string;
  sortDir: "asc" | "desc"; // Tipagem correta para sortDir
}

export const useSearch = () => {
  const [search, setSearch] = useState<SearchState>({
    filters: {
      query: undefined,
      hasAcceptedMarketing: undefined,
      isProspect: undefined,
      isReturning: undefined,
    },
    page: 0,
    rowsPerPage: 10,
    sortBy: "updatedAt",
    sortDir: "desc", // Valor inicial correto
  });

  return {
    search,
    updateSearch: setSearch,
  };
};


