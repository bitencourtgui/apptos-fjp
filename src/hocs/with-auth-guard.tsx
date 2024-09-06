import { AuthGuard } from "@/guards/auth-guard";
import React, { ComponentType } from "react";

export const withAuthGuard = <P extends object>(
  Component: ComponentType<P>
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <AuthGuard>
        <Component {...props} />
      </AuthGuard>
    );
  };

  return WrappedComponent;
};
