"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getProcessByCustomerId,
  getProcessById,
  getProcesses,
  updateProcessAPI,
} from "@/api/processes"; // Substitua pelas funções corretas de API para processos
import { useMounted } from "./use-mounted";
import { setDoc, doc } from "firebase/firestore";
import { getFirebaseStore } from "@/lib/auth/firebase/client";

interface ProcessState {
  processes: any; // Defina um tipo mais específico para o processo, se possível
  reload: () => void;
  processesCount: number;
}

export const useProcesses = (): ProcessState => {
  const [state, setState] = useState<ProcessState>({
    processes: [],
    processesCount: 0,
    reload: () => {},
  });

  const fetchProcesses = useCallback(async () => {
    try {
      const response = await getProcesses();

      if (response) {
        setState({
          reload: fetchProcesses,
          processes: response.data || [],
          processesCount: response.data?.length || 0, // Ajuste conforme sua necessidade
        });
      }
    } catch (err) {
      //   console.error("Failed to fetch processes:", err);
    }
  }, []);

  useEffect(() => {
    fetchProcesses();
  }, [fetchProcesses]);

  return state;
};

export const useProcessById = (id: string): any => {
  const isMounted = useMounted();
  const [state, setState] = useState<any>({
    process: null,
    reload: () => {},
    isLoading: true,
    error: null,
  });

  const fetchProcess = useCallback(async () => {
    setState((prevState: any) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await getProcessById(id);

      if (isMounted()) {
        setState({
          process: response.data || null,
          reload: fetchProcess,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      if (isMounted()) {
        setState((prevState: any) => ({
          ...prevState,
          isLoading: false,
          error: error.message || "Erro ao buscar processo",
        }));
      }
    }
  }, [id, isMounted]);

  useEffect(() => {
    fetchProcess();
  }, [fetchProcess]);

  return state;
};

export const useProcessByCustomerId = (id: string): any => {
  const isMounted = useMounted();

  const [state, setState] = useState<any>({
    response: null,
    reload: () => {},
  });

  const fetchProcess = useCallback(async () => {
    try {
      const response = await getProcessByCustomerId(id);

      if (isMounted()) {
        setState({
          reload: fetchProcess,
          processes: response.data,
        });
      }
    } catch (err) {
      // console.error("Failed to fetch process:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchProcess();
  }, [fetchProcess]);

  return state;
};

export const useUpdateProcess = (): [
  any,
  (processId: string, payload: any) => Promise<void>,
] => {
  const isMounted = useMounted();
  const [state, setState] = useState<any>({
    isLoading: false,
    error: null,
    success: false,
    reload: () => {}, // Função de reload que pode ser usada após a atualização
  });

  const updateProcess = useCallback(
    async (processId: string, payload: any) => {
      setState((prevState: any) => ({
        ...prevState,
        isLoading: true,
        error: null,
      }));
      try {
        await updateProcessAPI(processId, payload);

        if (isMounted()) {
          setState((prevState: any) => ({
            ...prevState,
            isLoading: false,
            success: true,
            reload: () => updateProcess(processId, payload),
          }));
        }
      } catch (error: any) {
        if (isMounted()) {
          setState((prevState: any) => ({
            ...prevState,
            isLoading: false,
            success: false,
            error: error.message || "Erro ao atualizar processo",
          }));
        }
      }
    },
    [isMounted],
  );

  return [state, updateProcess];
};

export const useAddProcess = (): [
  (processId: string, values: any) => Promise<void>, // Ensure this is the function type
  { isLoading: boolean; error: string | null; success: boolean; reload: () => void; }
] => {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    success: false,
    reload: () => {},
  });

  const db = getFirebaseStore();

  const addProcess = useCallback(
    async (processId: string, values: any) => {
      setState({ isLoading: true, error: null, success: false, reload: () => {} });

      try {
        await setDoc(doc(db, "processes", processId), values);
        setState({
          isLoading: false,
          error: null,
          success: true,
          reload: () => addProcess(processId, values),
        });
      } catch (error: any) {
        setState({
          isLoading: false,
          error: error.message || "Erro ao adicionar processo",
          success: false,
          reload: () => addProcess(processId, values),
        });
      }
    },
    [db] // Add dependencies as necessary
  );

  return [addProcess, state]; // Ensure the order is correct
};