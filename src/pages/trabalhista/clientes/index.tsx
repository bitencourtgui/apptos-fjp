import { Layout as DashboardLayout } from "../../../layouts/dashboard";

import ClientesDash from "../../dashboard/clientes";

const Clientes = () => {
  return <ClientesDash />;
};

Clientes.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Clientes;
