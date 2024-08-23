/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useMounted } from "./use-mounted";
import ContractsApi from "@/api/contracts";

export const useContractsByUserId = (userId, request = {}) => {
  const isMounted = useMounted();
  const [state, setState] = useState({ contracts: [], reload: () => {} });

  const getContractsByUserId = useCallback(async () => {
    try {
      const response = await ContractsApi.getContractsByUserId(userId, request);

      if (isMounted()) {
        setState({
          contracts: response.data,
          reload: getContractsByUserId,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getContractsByUserId();
  }, []);

  return state;
};
