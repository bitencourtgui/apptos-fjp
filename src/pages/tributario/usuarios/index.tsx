import React from "react"
import { Layout as DashboardLayout } from "../../../layouts/dashboard";

import UsuariosDash from "../../dashboard/usuarios/index";

const Usuarios = () => {
  return <UsuariosDash />;
};

Usuarios.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Usuarios;
