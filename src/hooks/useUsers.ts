/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useMounted } from "./use-mounted";
import UserApi from "@/api/users";

export const useUsers = () => {
  const isMounted = useMounted();
  const [state, setState] = useState<any>({ users: [], reload: undefined });

  const getUsers = useCallback(async () => {
    try {
      const response = await UserApi.getUsers();

      if (isMounted()) {
        setState({
          users: response.data,
          reload: getUsers,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getUsers();
  }, []);

  return state;
};
