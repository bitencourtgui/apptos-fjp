import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { getFirebaseStore } from "@/lib/auth/firebase/client";

const db = getFirebaseStore();

interface Customer {
  id: string;
  name: string;
}

export const getCustomers = async (): Promise<{ data: Customer[] } | undefined> => {
  const customersCollection = collection(db, "customers");

  try {
    const data = await getDocs(customersCollection);
    const customers = data.docs.map((docs) => ({ ...docs.data(), id: docs.id })) as Customer[];

    return {
      data: customers,
    };
  } catch (error) {
    return undefined;
  }
};

export const getCustomerById = async (id: string): Promise<{ data: Customer | undefined }> => {
  const customerDoc = doc(db, "customers", id);

  try {
    const docSnap = await getDoc(customerDoc);

    if (docSnap.exists()) {
      return {
        data: {
          id: docSnap.id,
          ...docSnap.data(),
        } as Customer,
      };
    } else {
      return {
        data: undefined,
      };
    }
  } catch (error) {
    return {
      data: undefined,
    };
  }
};

// Função para atualizar um cliente existente
export const updateCustomerAPI = async (
  id: string,
  updatedData: Partial<Customer>
): Promise<{ success: boolean; error?: string }> => {
  const customerDoc = doc(db, "customers", id);

  try {
    await updateDoc(customerDoc, updatedData);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
