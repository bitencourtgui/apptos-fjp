/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useMounted } from "./use-mounted";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getFirebaseStore } from "@/lib/auth/firebase/client";

export const useUsers = () => {
  const isMounted = useMounted();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const db = getFirebaseStore();

  const getUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);

      const usersList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (isMounted()) {
        setUsers(usersList);
      }
    } catch (err) {
      if (isMounted()) {
        // Verifica se o erro é uma instância de Error e define a mensagem
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
      }
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, [db, isMounted]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return {
    users,
    loading,
    error,
    reload: getUsers,
  };
};

export const useUser = (userId?: string) => {
  const isMounted = useMounted();
  const [user, setUser] = useState<any>(null);
  const db = getFirebaseStore();

  const getUser = useCallback(async () => {
    if (!userId) return;

    try {
      const userDoc = doc(db, "users", userId);
      const docSnap = await getDoc(userDoc);

      if (isMounted() && docSnap.exists()) {
        setUser({
          id: docSnap.id,
          ...docSnap.data(),
        });
      }
    } catch (err) {
      console.error("[useUser] Error:", err);
    }
  }, [userId, isMounted, db]);

  const createUser = useCallback(
    async (values: Partial<any>) => {
      if (!userId) {
        console.error("[useUser] Error: Nenhum userId fornecido para criar.");
        return {
          status: 901,
          res: "failure",
        };
      }

      try {
        const userDoc = doc(db, "users", userId);
        await setDoc(userDoc, values, { merge: true });

        if (isMounted()) {
          setUser((prevUser: any) => ({
            ...prevUser!,
            ...values,
          }));
        }

        return {
          status: 200,
          res: "success",
        };
      } catch (error) {
        console.error("[useUser] Error ao definir o usuário:", error);
        return {
          status: 901,
          res: "failure",
        };
      }
    },
    [userId, db, isMounted],
  );

  const updateUser = useCallback(
    async (values: Partial<any>, id?: string) => {
      const currentId = id || userId;

      if (!currentId) {
        console.error(
          "[useUser] Error: Nenhum userId fornecido para atualizar.",
        );
        return {
          status: 902,
          res: "failure",
        };
      }

      try {
        const userDoc = doc(db, "users", currentId);
        await updateDoc(userDoc, values);

        if (isMounted()) {
          setUser((prevUser: any) => {
            if (prevUser === null) {
              return { id: currentId, ...values };
            }
            return {
              ...prevUser,
              ...values,
            };
          });
        }

        return {
          status: 200,
          res: "success",
        };
      } catch (error) {
        console.error("[useUser] Error ao atualizar o usuário:", error);
        return {
          status: 902,
          res: "failure",
        };
      }
    },
    [userId, db, isMounted],
  );

  const deleteUser = useCallback(async () => {
    if (!userId) {
      console.error("[useUser] Error: Nenhum userId fornecido para deletar.");
      return {
        status: 903,
        res: "failure",
      };
    }

    try {
      const userDoc = doc(db, "users", userId);
      await deleteDoc(userDoc);

      if (isMounted()) {
        setUser(null);
      }

      return {
        status: 200,
        res: "success",
      };
    } catch (error) {
      console.error("[useUser] Error ao deletar o usuário:", error);
      return {
        status: 903,
        res: "failure",
      };
    }
  }, [userId, db, isMounted]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return {
    user,
    getUser,
    createUser,
    updateUser,
    deleteUser,
  };
};

export const useUserByEmail = (email: string): any => {
  const isMounted = useMounted();
  const db = getFirebaseStore();

  const [state, setState] = useState<any>({
    client: null,
    error: null,
    reload: () => {},
  });

  const fetchUserByEmail = useCallback(async () => {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("user", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Assumindo que você quer o primeiro usuário encontrado
        const userData = {
          id: userDoc.id,
          ...userDoc.data(),
        };

        if (isMounted()) {
          setState({
            client: userData,
            error: null,
            reload: fetchUserByEmail, // Função de recarregar
          });
        }
      } else {
        if (isMounted()) {
          setState({
            client: null,
            error: "Usuário não encontrado",
            reload: fetchUserByEmail,
          });
        }
      }
    } catch (err) {
      if (isMounted()) {
        setState({
          client: null,
          error: "Erro ao buscar o usuário",
          reload: fetchUserByEmail,
        });
      }
    }
  }, [email, db, isMounted]);

  useEffect(() => {
    if (email) {
      fetchUserByEmail();
    }
  }, [fetchUserByEmail]);

  return state;
};
