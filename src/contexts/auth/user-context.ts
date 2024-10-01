import type * as React from "react";

import { config } from "@/config";
import { AuthStrategy } from "@/lib/auth/strategy";

import {
  UserContext as FirebaseUserContext,
  UserProvider as FirebaseUserProvider,
} from "./firebase/user-context";
import type { UserContextValue } from "./types";

// eslint-disable-next-line import/no-mutable-exports -- Export based on config
let UserProvider: React.FC<{ children: React.ReactNode }>;

// eslint-disable-next-line import/no-mutable-exports -- Export based on config
let UserContext: React.Context<UserContextValue | undefined>;

switch (config.auth.strategy) {
  case AuthStrategy.FIREBASE:
    UserContext = FirebaseUserContext;
    UserProvider = FirebaseUserProvider;
    break;

  default:
    throw new Error("Invalid auth strategy");
}

export { UserProvider, UserContext };
