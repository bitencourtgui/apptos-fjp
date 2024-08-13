import { createContext, useCallback, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { firebaseApp } from "../../libs/firebase";
import { Issuer } from "../../utils/auth";
import { cleanText } from "../../utils/clear-text";
const storage = globalThis.localStorage;

const auth = getAuth(firebaseApp);
const TENANT_KEY = "app.tenant";

const getTenant = () => {
  let value = null;

  try {
    const restored = storage.getItem(TENANT_KEY);

    if (restored) {
      value = cleanText(restored);
    }
  } catch (err) {
    console.error(err);
  }

  return value;
};

const setTenant = (value) => {
  storage.setItem(TENANT_KEY, JSON.stringify(value));
};

var ActionType;
(function (ActionType) {
  ActionType["AUTH_STATE_CHANGED"] = "AUTH_STATE_CHANGED";
})(ActionType || (ActionType = {}));

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === "AUTH_STATE_CHANGED") {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

export const AuthContext = createContext({
  ...initialState,
  issuer: Issuer.Firebase,
  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  getTenant,
  setTenant,
  updateUserName: () => Promise.resolve(),
  updateUserPassword: () => Promise.resolve(), // Adiciona a função ao contexto
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleAuthStateChanged = useCallback(
    (user) => {
      if (user) {
        dispatch({
          type: ActionType.AUTH_STATE_CHANGED,
          payload: {
            isAuthenticated: true,
            user: {
              id: user.uid,
              avatar: user.photoURL || undefined,
              email: user.email || "anika.visser@devias.io",
              name: "Guilherme Bitencourt",
              plan: "Premium",
            },
          },
        });
      } else {
        dispatch({
          type: ActionType.AUTH_STATE_CHANGED,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    },
    [dispatch]
  );

  useEffect(() => onAuthStateChanged(auth, handleAuthStateChanged), []);

  const _signInWithEmailAndPassword = useCallback(
    async (email, password, tenant) => {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem(TENANT_KEY, tenant);
    },
    []
  );

  const signInWithGoogle = useCallback(async (name) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Chama a função para atualizar o nome de usuário
      await _updateUserName(user, name);
    } catch (error) {
      console.error("Erro ao fazer login com o Google:", error);
    }
  }, []);

  const reauthenticateUser = async (currentPassword) => {
    const user = auth.currentUser;
    if (user) {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      try {
        await reauthenticateWithCredential(user, credential);
        console.log("Usuário reautenticado com sucesso.");
      } catch (error) {
        console.error("Erro ao reautenticar o usuário:", error);
        throw error; // Propague o erro para tratar na interface
      }
    }
  };

  // Função para atualizar o nome de usuário
  const updateUserName = async (name) => {
    const user = auth.currentUser;

    if (user) {
      try {
        await updateProfile(user, {
          displayName: name,
        });
        dispatch({
          type: ActionType.AUTH_STATE_CHANGED,
          payload: {
            isAuthenticated: true,
            user: {
              ...state.user,
              name,
            },
          },
        });
        console.log("Nome de usuário atualizado com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar o nome de usuário:", error);
      }
    }
  };

  // Função para atualizar a senha do usuário
  const updateUserPassword = async (newPassword) => {
    const user = auth.currentUser;

    if (user) {
      try {
        await updatePassword(user, newPassword);
        console.log("Senha atualizada com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar a senha:", error);
      }
    }
  };

  const _createUserWithEmailAndPassword = useCallback(
    async (email, password, name) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Chama a função para atualizar o nome de usuário
        await _updateUserName(user, name);
      } catch (error) {
        console.error("Erro ao criar o usuário:", error);
      }
    },
    []
  );

  const _signOut = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: Issuer.Firebase,
        createUserWithEmailAndPassword: _createUserWithEmailAndPassword,
        signInWithEmailAndPassword: _signInWithEmailAndPassword,
        signInWithGoogle,
        signOut: _signOut,
        getTenant,
        setTenant,
        updateUserName,
        updateUserPassword,
        updateUserPassword,
        reauthenticateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AuthConsumer = AuthContext.Consumer;
