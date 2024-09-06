"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useMounted } from "./use-mounted";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseStore } from "@/lib/auth/firebase/client";

interface State {
  contracts: any;
  reload: () => void;
}

export const useContractsByUserId = (userId: string, request = {}) => {
  const isMounted = useMounted();
  const [state, setState] = useState<State>({
    contracts: [],
    reload: () => {},
  });
  const db = getFirebaseStore();

  const getContractsByUserId = useCallback(async () => {
    try {
      const contractsCollection = collection(db, "contracts");
      const data = await getDocs(contractsCollection);
      const contracts = data.docs
        .filter((doc) => doc.data().userId === userId) // Filtra contratos pelo userId
        .map((doc) => ({ ...doc.data(), id: doc.id })) as any[];

      if (isMounted()) {
        setState({
          contracts,
          reload: getContractsByUserId,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, db, userId]);

  useEffect(() => {
    getContractsByUserId();
  }, [getContractsByUserId]);

  return state;
};

export const useContract = (contractId?: string) => {
  const isMounted = useMounted();
  const [contract, setContract] = useState<any>(null);
  const db = getFirebaseStore();

  const getContract = useCallback(async () => {
    if (!contractId) return;

    try {
      const contractDoc = doc(db, "contracts", contractId);
      const docSnap = await getDoc(contractDoc);

      if (isMounted() && docSnap.exists()) {
        setContract({
          id: docSnap.id,
          ...docSnap.data(),
        } as any);
      }
    } catch (err) {
      console.error("[useContract] Error:", err);
    }
  }, [contractId, isMounted, db]);

  const createContract = useCallback(
    async (values: Partial<any>) => {
      if (!contractId) {
        console.error(
          "[useContract] Error: Nenhum contractId fornecido para criar.",
        );
        return {
          status: 901,
          res: "failure",
        };
      }

      try {
        const contractDoc = doc(db, "contracts", contractId);
        await setDoc(contractDoc, values, { merge: true });

        if (isMounted()) {
          setContract((prevContract: any) => ({
            ...prevContract!,
            ...values,
          }));
        }

        return {
          status: 200,
          res: "success",
        };
      } catch (error) {
        console.error("[useContract] Error ao definir o contrato:", error);
        return {
          status: 901,
          res: "failure",
        };
      }
    },
    [contractId, db, isMounted],
  );

  const updateContract = useCallback(
    async (values: Partial<any>, id?: string) => {
      const currentId = id || contractId;

      if (!currentId) {
        console.error(
          "[useContract] Error: Nenhum contractId fornecido para atualizar.",
        );
        return {
          status: 902,
          res: "failure",
        };
      }

      try {
        const contractDoc = doc(db, "contracts", currentId);
        await updateDoc(contractDoc, values);

        if (isMounted()) {
          setContract((prevContract: any) => {
            if (prevContract === null) {
              return { id: currentId, ...values } as any;
            }
            return {
              ...prevContract,
              ...values,
            };
          });
        }

        return {
          status: 200,
          res: "success",
        };
      } catch (error) {
        console.error("[useContract] Error ao atualizar o contrato:", error);
        return {
          status: 902,
          res: "failure",
        };
      }
    },
    [contractId, db, isMounted],
  );

  const deleteContract = useCallback(async () => {
    if (!contractId) {
      console.error(
        "[useContract] Error: Nenhum contractId fornecido para deletar.",
      );
      return {
        status: 903,
        res: "failure",
      };
    }

    try {
      const contractDoc = doc(db, "contracts", contractId);
      await deleteDoc(contractDoc);

      if (isMounted()) {
        setContract(null);
      }

      return {
        status: 200,
        res: "success",
      };
    } catch (error) {
      console.error("[useContract] Error ao deletar o contrato:", error);
      return {
        status: 903,
        res: "failure",
      };
    }
  }, [contractId, db, isMounted]);

  useEffect(() => {
    getContract();
  }, [getContract]);

  return {
    contract,
    getContract,
    createContract,
    updateContract,
    deleteContract,
  };
};
