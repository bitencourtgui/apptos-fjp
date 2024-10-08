"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCustomerById,
  getCustomers,
  updateCustomerAPI,
} from "@/api/customers";
import { useMounted } from "./use-mounted";
import { setDoc, doc, deleteDoc } from "firebase/firestore"; // Import deleteDoc para deletar o customer
import { getFirebaseStore } from "@/lib/auth/firebase/client";

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

export const useCustomerById = (id: string): any => {
  const isMounted = useMounted();
  const db = getFirebaseStore();

  const [state, setState] = useState<any>({
    response: null,
    reload: () => {},
    isDeleting: false, // Estado para deletar
    deleteError: null,  // Armazenar erros de exclusão
  });

  const fetchCustomer = useCallback(async () => {
    try {
      const response = await getCustomerById(id);

      if (isMounted()) {
        setState({
          reload: fetchCustomer,
          customers: response.data,
          isDeleting: false,
          deleteError: null,
        });
      }
    } catch (err) {
      // console.error("Failed to fetch customer:", err);
    }
  }, [id]);

  const deleteCustomer = useCallback(async () => {
    setState((prevState: any) => ({
      ...prevState,
      isDeleting: true,
      deleteError: null,
    }));

    try {
      await deleteDoc(doc(db, "customers", id)); // Deleta o documento do Firebase

      if (isMounted()) {
        setState((prevState: any) => ({
          ...prevState,
          customers: null, // Reseta o cliente após a exclusão
          isDeleting: false,
          deleteError: null,
        }));
      }
    } catch (error: any) {
      if (isMounted()) {
        setState((prevState: any) => ({
          ...prevState,
          isDeleting: false,
          deleteError: error.message || "Erro ao deletar cliente",
        }));
      }
    }
  }, [id, isMounted]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  return { ...state, deleteCustomer }; // Retorna também a função de deletar
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

export const useAddCustomer = (): [
  any,
  (customerId: string, values: any) => Promise<void>,
] => {
  const isMounted = useMounted();
  const db = getFirebaseStore();
  const [state, setState] = useState<any>({
    isLoading: false,
    error: null,
    success: false,
    reload: () => {},
  });

  const addCustomer = useCallback(
    async (customerId: string, values: any) => {
      setState((prevState: any) => ({
        ...prevState,
        isLoading: true,
        error: null,
      }));

      try {
        await setDoc(doc(db, "customers", customerId), values);

        if (isMounted()) {
          setState({
            isLoading: false,
            success: true,
            error: null,
            reload: () => addCustomer(customerId, values),
          });
        }
      } catch (error: any) {
        if (isMounted()) {
          setState({
            isLoading: false,
            success: false,
            error: error.message || "Erro ao adicionar cliente",
            reload: () => addCustomer(customerId, values),
          });
        }
      }
    },
    [isMounted],
  );

  return [state, addCustomer];
};
