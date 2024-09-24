import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getFirebaseStore } from "@/lib/auth/firebase/client";

const db = getFirebaseStore();

interface Process {
  id: string;
  name: string;
}

export const getProcesses = async (): Promise<{ data: Process[] } | undefined> => {
  const processesCollection = collection(db, "processes");

  try {
    const data = await getDocs(processesCollection);
    const processes = data.docs.map((docs) => ({ ...docs.data(), id: docs.id })) as Process[];

    return {
      data: processes,
    };
  } catch (error) {
    return undefined;
  }
};

export const getProcessById = async (processId: string): Promise<{ data: any }> => {
  const processRef = doc(db, "processes", processId);

  try {
    const processDoc = await getDoc(processRef);

    if (processDoc.exists()) {
      const process = { id: processDoc.id, ...processDoc.data() } as any;
      return { data: process };
    } else {
      return { data: undefined };
    }
  } catch (error) {
    console.error("Erro ao buscar o processo:", error);  // Log para erros
    return { data: undefined };
  }
};


export const getProcessByCustomerId = async (customerId: string): Promise<{ data: Process[] | undefined }> => {
  const processesRef = collection(db, "processes");

  try {
    const q = query(processesRef, where("customerId", "==", customerId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const processes: Process[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Process));

      return { data: processes };
    } else {
      return { data: undefined };
    }
  } catch (error) {
    return { data: undefined };
  }
};

// Função para atualizar um processo existente
export const updateProcessAPI = async (
  id: string,
  updatedData: Partial<Process>
): Promise<{ success: boolean; error?: string }> => {
  const processDoc = doc(db, "processes", id);

  try {
    await updateDoc(processDoc, updatedData);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
