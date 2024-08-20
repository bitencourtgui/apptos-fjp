import {
  collection,
  getDocs,
  getDoc,
  getFirestore,
  query,
  deleteDoc,
  setDoc,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { firebaseApp } from "../../libs/firebase";

const db = getFirestore(firebaseApp);
const processCollection = "process";

class ProcessApi {
  static async getAllProcess() {
    try {
      const ref = collection(db, processCollection);
      const querySnapshot = await getDocs(ref);
      let data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      return Promise.resolve({
        data,
      });
    } catch (error) {
      console.error("Erro ao buscar o documento:", error);
      throw error; // lançar o erro para ser tratado pelo código que chama esta função
    }
  }

  static async getProcess(processId) {
    const ref = doc(db, processCollection, processId);
    try {
      let data = await getDoc(ref);

      data = { ...data.data(), id: data.id };

      return Promise.resolve({
        data,
      });
    } catch (error) {
      console.error("Erro ao buscar o processo:", error);
    }
  }

  static async getProcessByUser(customerId) {
    try {
      const ref = collection(db, processCollection);
      const querySnapshot = await getDocs(
        query(ref, where("customerId", "==", customerId))
      );
      let data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      let count = data.length;

      return Promise.resolve({
        data,
        count,
      });
    } catch (error) {
      console.error("Erro ao buscar o processo:", error);
    }
  }

  static async setProcess(processId, values) {
    try {
      await setDoc(doc(db, processCollection, processId), values);

      return {
        status: 200,
        res: "success",
      };
    } catch (error) {
      console.error("Erro ao cadastrar o processo:", error);
      return {
        status: 901,
        res: `Erro: ${error}`,
      };
    }
  }

  static async updateProcess(processId, values) {
    const ref = doc(db, processCollection, processId);

    try {
      await updateDoc(ref, values);

      return {
        status: 200,
        res: "success",
      };
    } catch (error) {
      console.error("Erro ao atualizar o processo:", error);
      return {
        status: 901,
        res: `Erro: ${error}`,
      };
    }
  }

  static async deleteProcess(processId) {
    const ref = doc(db, processCollection, processId);

    try {
      await deleteDoc(ref);

      return {
        status: 200,
        res: "success",
      };
    } catch (error) {
      console.error("Erro ao atualizar o processo:", error);
      return {
        status: 901,
        res: `Erro: ${error}`,
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

export default ProcessApi;
