import {
  getDocs,
  getFirestore,
  collection,
  setDoc,
  doc,
} from "firebase/firestore";
import { firebaseApp } from "../../libs/firebase";

const db = getFirestore(firebaseApp);
const processCollection = "users";

class UserApi {
  static async getUsers() {
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
      console.error("Erro ao buscar o usuários:", error);
      throw error;
    }
  }

  static async createUser(processId, values) {
    try {
      await setDoc(doc(db, processCollection, processId), values);

      return {
        status: 200,
        res: "success",
      };
    } catch (error) {
      console.error("Erro ao cadastrar o usuário:", error);
      return {
        status: 901,
        res: `Erro: ${error}`,
      };
    }
  }
}

export default UserApi;
