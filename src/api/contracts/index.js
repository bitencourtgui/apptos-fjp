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
  getFirestore,
} from "firebase/firestore";
import { firebaseApp } from "../../libs/firebase";
import { applySort } from "../../utils/apply-sort";
import { applyPagination } from "../../utils/apply-pagination";
import { deepCopy } from "../../utils/deep-copy";

const db = getFirestore(firebaseApp);
const contractsCollection = "contracts"; // Coleção de contratos

class ContractsApi {
  // ... Métodos existentes para customers

  static async getContracts({ filters, page, rowsPerPage, sortBy, sortDir }) {
    try {
      const ref = collection(db, contractsCollection);
      const querySnapshot = await getDocs(ref);
      let data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      let count = data.length;

      if (typeof filters !== "undefined") {
        data = data.filter((contract) => {
          if (typeof filters.query !== "undefined" && filters.query !== "") {
            let queryMatched = false;
            const properties = ["contractId", "contractType"]; // Exemplos de propriedades

            properties.forEach((property) => {
              if (
                contract[property]
                  .toLowerCase()
                  .includes(filters.query.toLowerCase())
              ) {
                queryMatched = true;
              }
            });

            if (!queryMatched) {
              return false;
            }
          }

          if (typeof filters.status !== "undefined") {
            if (contract.status !== filters.status) {
              return false;
            }
          }

          return true;
        });
        count = data.length;
      }

      if (typeof sortBy !== "undefined" && typeof sortDir !== "undefined") {
        data = applySort(data, sortBy, sortDir);
      }

      if (typeof page !== "undefined" && typeof rowsPerPage !== "undefined") {
        data = applyPagination(data, page, rowsPerPage);
      }

      return Promise.resolve({
        data,
        count,
      });
    } catch (error) {
      console.error("Error fetching contracts:", error);
      throw error;
    }
  }

  static async getContractsByUserId(userId, request = {}) {
    const { page, rowsPerPage, sortBy, sortDir } = request;

    try {
      // Cria uma referência para a coleção de contratos
      const ref = collection(db, contractsCollection);
      // Cria uma consulta com filtro para o userId
      const q = query(ref, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      let data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      let count = data.length;

      if (typeof sortBy !== "undefined" && typeof sortDir !== "undefined") {
        data = applySort(data, sortBy, sortDir);
      }

      if (typeof page !== "undefined" && typeof rowsPerPage !== "undefined") {
        data = applyPagination(data, page, rowsPerPage);
      }

      return Promise.resolve({
        data,
        count,
      });
    } catch (error) {
      console.error("Error fetching contracts by userId:", error);
      throw error;
    }
  }

  static async getContract(contractId) {
    const getContractRef = doc(db, contractsCollection, contractId.toString());

    try {
      let data = await getDoc(getContractRef);

      if (data.exists()) {
        data = { ...data.data(), id: data.id };
      }

      return Promise.resolve({
        data,
      });
    } catch (error) {
      console.error("Erro ao buscar o contrato:", error);
      throw error;
    }
  }

  static async setContract(contractId, values) {
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
  }

  static async updateContract(contractId, values) {
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
  }

  static async deleteContract(contractId) {
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
  }

  static async getTotalContractCount() {
    const ref = collection(db, contractsCollection);

    try {
      const querySnapshot = await getDocs(ref);
      let data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      let count = data.length;

      return Promise.resolve({
        count,
      });
    } catch (error) {
      console.error("Erro ao buscar os contratos:", error);
      throw error;
    }
  }
}

export default ContractsApi;
