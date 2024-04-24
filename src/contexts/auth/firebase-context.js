import { createContext, useCallback, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
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
    // If stored data is not a strigified JSON this will fail,
    // that's why we catch the error
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
  setTenant
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleAuthStateChanged = useCallback(
    (user) => {
      if (user) {
        // Here you should extract the complete user profile to make it available in your entire app.
        // The auth state only provides basic information.
        dispatch({
          type: ActionType.AUTH_STATE_CHANGED,
          payload: {
            isAuthenticated: true,
            user: {
              id: user.uid,
              avatar: user.photoURL || undefined,
              email: user.email || "anika.visser@devias.io",
              name: "Anika Visser",
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

  useEffect(
    () => onAuthStateChanged(auth, handleAuthStateChanged),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const _signInWithEmailAndPassword = useCallback(
    async (email, password, tenant) => {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem(TENANT_KEY, tenant);
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);
  }, []);

  const _createUserWithEmailAndPassword = useCallback(
    async (email, password) => {
      await createUserWithEmailAndPassword(auth, email, password);
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
