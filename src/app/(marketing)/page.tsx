"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";

import { logger } from "@/lib/default-logger";
import { useUser } from "@/hooks/use-user";

export default function Page(): JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkPermissions = async (): Promise<void> => {
      if (isLoading) {
        return;
      }

      if (error) {
        setIsChecking(false);
        return;
      }

      if (!user) {
        logger.debug("[Page]: User is not logged in, redirecting to /auth");
        router.replace("/auth");
        return;
      }

      logger.debug("[Page]: User is logged in, redirecting to /visao-geral");
      router.replace("/visao-geral");
    };

    checkPermissions().catch(() => {
      // noop
    });
  }, [user, error, isLoading, router]);

  if (isChecking || isLoading) {
    return null; // ou um spinner, se preferir
  }

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  return (
    <main>
      <div>algo</div>
    </main>
  );
}
