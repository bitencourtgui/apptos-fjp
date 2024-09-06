"use client"

import { ReactNode, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/hooks/use-auth";
import { Issuer } from "@/utils/auth";

const loginPaths: Record<Issuer, string> = {
  [Issuer.Amplify]: "/auth/amplify/login",
  [Issuer.Auth0]: "/auth/auth0/login",
  [Issuer.Firebase]: "/auth/login",
  [Issuer.JWT]: "/auth/jwt/login",
};

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  // const { isAuthenticated, issuer } = useAuth();
  const [checked, setChecked] = useState<boolean>(false);

  // console.log('isAuthenticated', isAuthenticated)

  // const check = useCallback(() => {
  //   if (!isAuthenticated) {
  //     const searchParams = new URLSearchParams({
  //       returnTo: globalThis.location.href,
  //     }).toString();
  //     const href = loginPaths[issuer] + `?${searchParams}`;
  //     router.replace(href);
  //   } else {
  //     setChecked(true);
  //   }
  // }, [isAuthenticated, issuer, router]);

  // // Only check on mount, this allows us to redirect the user manually when auth state changes
  // useEffect(() => {
  //   check();
  // }, [check]);

  // if (!checked) {
  //   return null;
  // }

  // // If got here, it means that the redirect did not occur, and that tells us that the user is
  // // authenticated / authorized.

  return <>{children}</>;
};
