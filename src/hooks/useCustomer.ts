import { useCallback, useEffect, useState } from "react";
import { useMounted } from "./use-mounted";
import customersApi from "@/api/customers";

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
  sortDir: "asc" | "desc";
}

interface CustomerState {
  customers: any[]; // Defina um tipo mais específico para o cliente, se possível
  reload: () => void;
  customersCount: number;
}

export const useCustomers = (search?: SearchState): CustomerState => {
  const isMounted = useMounted();
  const [state, setState] = useState<CustomerState>({
    customers: [],
    customersCount: 0,
    reload: () => {},
  });

  const getCustomers = useCallback(async () => {
    try {
      const response = await customersApi.getCustomers(search);

      if (isMounted()) {
        setState({
          reload: getCustomers,
          customers: response.data,
          customersCount: response.count,
        });
      }
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  }, [isMounted, search]);

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  return state;
};

export const useCustomer = (userId: string) => {
  const isMounted = useMounted();
  const [customer, setCustomer] = useState(null);

  const getCustomer = useCallback(async () => {
    try {
      const response = await customersApi.getCustomer(userId.toString());
      if (isMounted()) {
        setCustomer(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, userId]);

  useEffect(() => {
    getCustomer();
  }, [getCustomer]);

  return { customer, getCustomer };
};
