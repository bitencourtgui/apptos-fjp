import {
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { getFirebaseStore } from "@/lib/auth/firebase/client";
import { applySort } from "@/utils/apply-sort";
import { applyPagination } from "@/utils/apply-pagination";

const db = getFirebaseStore();
const contractsCollection = "contracts"; // Coleção de contratos

interface Contract {
  id: string;
  contractId?: string;
  contractType?: string;
  status?: string;
  [key: string]: any; // Permite acesso dinâmico a propriedades adicionais
}

export const getContracts = async ({
  filters,
  page,
  rowsPerPage,
  sortBy,
  sortDir,
}: {
  filters?: { query?: string; status?: string };
  page?: number;
  rowsPerPage?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}): Promise<{ data: Contract[]; count: number }> => {
  try {
    const ref = collection(db, contractsCollection);
    const querySnapshot = await getDocs(ref);
    let data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Contract[];

    let count = data.length;

    if (filters) {
      data = data.filter((contract) => {
        if (filters.query) {
          let queryMatched = false;
          const properties = ["contractId", "contractType"];

          properties.forEach((property) => {
            if (
              contract[property]
                ?.toLowerCase()
                .includes(filters.query!.toLowerCase())
            ) {
              queryMatched = true;
            }
          });

          if (!queryMatched) {
            return false;
          }
        }

        if (filters.status && contract.status !== filters.status) {
          return false;
        }

        return true;
      });
      count = data.length;
    }

    if (sortBy && sortDir) {
      data = applySort(data, sortBy, sortDir);
    }

    if (page !== undefined && rowsPerPage !== undefined) {
      data = applyPagination(data, page, rowsPerPage);
    }

    return { data, count };
  } catch (error) {
    console.error("Error fetching contracts:", error);
    throw error;
  }
};

export const getContractsByUserId = async (
  userId: string,
  request: {
    page?: number;
    rowsPerPage?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
  } = {},
): Promise<{ data: Contract[]; count: number }> => {
  const { page, rowsPerPage, sortBy, sortDir } = request;

  try {
    const ref = collection(db, contractsCollection);
    const q = query(ref, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    let data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Contract[];

    let count = data.length;

    if (sortBy && sortDir) {
      data = applySort(data, sortBy, sortDir);
    }

    if (page !== undefined && rowsPerPage !== undefined) {
      data = applyPagination(data, page, rowsPerPage);
    }

    return { data, count };
  } catch (error) {
    console.error("Error fetching contracts by userId:", error);
    throw error;
  }
};

export const getContract = async (
  contractId: string,
): Promise<{ data: any } | null> => {
  if (!contractId) {
    console.warn("[getContract] Invalid contractId:", contractId);
    return null;
  }

  const getContractRef = doc(db, contractsCollection, contractId.toString());

  try {
    const snapshot = await getDoc(getContractRef);

    if (snapshot.exists()) {
      const data = { ...snapshot.data(), id: snapshot.id };
      return { data };
    } else {
      console.warn("[getContract] Contract does not exist:", contractId);
      return null;
    }
  } catch (error) {
    console.error("[getContract] Error fetching contract:", error);
    throw error;
  }
};

export const setContract = async (
  contractId: string,
  values: any,
): Promise<{ status: number; res: string }> => {
  try {
    await setDoc(doc(db, contractsCollection, contractId), values);
    return {
      status: 200,
      res: "success",
    };
  } catch (error) {
    console.error("Erro ao definir o contrato:", error);
    return {
      status: 901,
      res: "failure",
    };
  }
};

export const createContract = async (
  contractId: string,
  values: any,
): Promise<{ status: number; res: string }> => {
  const updateRef = doc(db, contractsCollection, contractId);

  try {
    await updateDoc(updateRef, values);
    return {
      status: 200,
      res: "success",
    };
  } catch (error) {
    console.error("Erro ao atualizar o contrato:", error);
    return {
      status: 901,
      res: `Falha: ${error}`,
    };
  }
};

export const deleteContract = async (
  contractId: string,
): Promise<{ status: number; res: string }> => {
  const ref = doc(db, contractsCollection, contractId);
  try {
    await deleteDoc(ref);
    return {
      status: 200,
      res: "success",
    };
  } catch (error) {
    console.error("Erro ao deletar o contrato:", error);
    return {
      status: 901,
      res: `failure ${error}`,
    };
  }
};

export const getTotalContractCount = async (): Promise<{
  count: number;
}> => {
  const ref = collection(db, contractsCollection);

  try {
    const querySnapshot = await getDocs(ref);
    let data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    let count = data.length;

    return { count };
  } catch (error) {
    console.error("Erro ao buscar os contratos:", error);
    throw error;
  }
};
