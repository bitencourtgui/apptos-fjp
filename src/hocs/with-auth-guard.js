import { AuthGuard } from "../guards/auth-guard";

export const withAuthGuard = (Component) => (props) => {
  console.log("porops", props, Component);

  return (
    <AuthGuard>
      <Component {...props} />
    </AuthGuard>
  );
};
