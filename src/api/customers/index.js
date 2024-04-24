import {
  collection,
  doc,
  getDoc,
  setDoc,
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
const processCollection = "customers";

class CustomersApi {
  static async getCustomers(request = {}) {
    const { filters, page, rowsPerPage, sortBy, sortDir } = request;

    try {
      const ref = collection(db, processCollection);
      const querySnapshot = await getDocs(ref);
      let data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      let count = data.length;

      if (typeof filters !== "undefined") {
        data = data.filter((customer) => {
          if (typeof filters.query !== "undefined" && filters.query !== "") {
            let queryMatched = false;
            const properties = ["email", "name"];

            properties.forEach((property) => {
              if (
                customer[property]
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

          if (typeof filters.hasAcceptedMarketing !== "undefined") {
            if (
              customer.hasAcceptedMarketing !== filters.hasAcceptedMarketing
            ) {
              return false;
            }
          }

          if (typeof filters.isProspect !== "undefined") {
            if (customer.isProspect !== filters.isProspect) {
              return false;
            }
          }

          if (typeof filters.isReturning !== "undefined") {
            if (customer.isReturning !== filters.isReturning) {
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
      console.error("Error fetching customers:", error);
      throw error;
    }
  }
  static async getCustomer(customerId) {
    const getCustomerRef = doc(db, processCollection, customerId.toString());

    try {
      let data = await getDoc(getCustomerRef);

      if (data.exists()) {
        data = { ...data.data(), id: data.id };
      }

      return Promise.resolve({
        data,
      });
    } catch (error) {
      console.error("Erro ao buscar o documento:", error);
    }
  }

  static async getBusinessCustomer(document) {
    const formatted = document.replace(/[^\d]/g, "");

    try {
      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${formatted}`
      );
      const data = await response.json();
      return Promise.resolve(data);
    } catch (error) {
      console.error("Error ao buscar documento:", error);
      throw error;
    }
  }

  static async setCustomer(customerId, values) {
    try {
      await setDoc(doc(db, processCollection, customerId), values);
      return {
        status: 200,
        res: "success",
      };
    } catch (error) {
      return {
        status: 901,
        res: "failure",
      };
    }
  }

  static async updateCustomer(customerId, values) {
    const updateRef = doc(db, processCollection, customerId);

    try {
      await updateDoc(updateRef, values);
      return {
        status: 200,
        res: "success",
      };
    } catch (error) {
      return {
        status: 901,
        res: "failure",
      };
    }
  }

  static async deleteCustomer(id) {
    const ref = doc(db, processCollection, id);
    try {
      await deleteDoc(ref);
      return {
        status: 200,
        res: "success",
      };
    } catch (error) {
      return {
        status: 901,
        res: `failure ${error}`,
      };
    }
  }

  static async getTotalCount() {
    const ref = collection(db, processCollection);

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
      console.error("Erro ao buscar os documentos:", error);
    }
  }
}

export default CustomersApi;
