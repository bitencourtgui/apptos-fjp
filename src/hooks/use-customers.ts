"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCustomerById,
  getCustomers,
  updateCustomerAPI,
} from "@/api/customers";
import { useMounted } from "./use-mounted";

interface CustomerState {
  customers: any; // Defina um tipo mais específico para o cliente, se possível
  reload: () => void;
  customersCount: number;
}

export const useCustomers = (): CustomerState => {
  const [state, setState] = useState<CustomerState>({
    customers: [],
    customersCount: 0,
    reload: () => {},
  });

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await getCustomers();

      if (response) {
        setState({
          reload: fetchCustomers,
          customers: response.data || [],
          customersCount: response.data?.length || 0, // Ajuste conforme sua necessidade
        });
      }
    } catch (err) {
      //   console.error("Failed to fetch customers:", err);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return state;
};

export const useCustomerById = (id: string): CustomerState => {
  const isMounted = useMounted();

  const [state, setState] = useState<any>({
    response: null,
    reload: () => {},
  });

  const fetchCustomer = useCallback(async () => {
    try {
      const response = await getCustomerById(id);

      if (isMounted()) {
        setState({
          reload: fetchCustomer,
          customers: response.data,
        });
      }
    } catch (err) {
      // console.error("Failed to fetch customer:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  return state;
};

export const useUpdateCustomer = (): [
  any,
  (customerId: string, payload: any) => Promise<void>,
] => {
  const isMounted = useMounted();
  const [state, setState] = useState<any>({
    isLoading: false,
    error: null,
    success: false,
    reload: () => {}, // Função de reload que pode ser usada após a atualização
  });

  const updateCustomer = useCallback(
    async (customerId: string, payload: any) => {
      setState((prevState: any) => ({
        ...prevState,
        isLoading: true,
        error: null,
      }));
      try {
        await updateCustomerAPI(customerId, payload);

        if (isMounted()) {
          setState((prevState: any) => ({
            ...prevState,
            isLoading: false,
            success: true,
            reload: () => updateCustomer(customerId, payload),
          }));
        }
      } catch (error: any) {
        if (isMounted()) {
          setState((prevState: any) => ({
            ...prevState,
            isLoading: false,
            success: false,
            error: error.message || "Erro ao atualizar cliente",
          }));
        }
      }
    },
    [isMounted],
  );

  return [state, updateCustomer];
};
