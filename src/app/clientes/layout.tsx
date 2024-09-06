import * as React from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { DynamicLayout } from "@/layouts/dynamic-layout";

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "Clientes | FJP",
  icons: {
    icon: '/assets/icons/favicon.ico',
  },
};

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <AuthGuard>
      <DynamicLayout>{children}</DynamicLayout>
    </AuthGuard>
  );
}
