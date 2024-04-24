import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import AdicionarClienteDash from "../../dashboard/clientes/adicionar";

const Page = () => {
  return <AdicionarClienteDash />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
