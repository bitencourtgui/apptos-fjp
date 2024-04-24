import { collection, getDocs, getFirestore } from "firebase/firestore";
import { firebaseApp } from "../../libs/firebase";

const db = getFirestore(firebaseApp);
const processCollection = "lawyers";

class LawyersApi {
  static async getLawyers() {
    const ref = collection(db, processCollection);
    try {
      let data = await getDocs(ref);
      data = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      return Promise.resolve({
        data,
      });
    } catch (error) {
      console.error("Erro ao buscar o Advogados:", error);
    }
  }
}

export default LawyersApi;
