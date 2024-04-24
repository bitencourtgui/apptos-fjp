import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import ListaProcessos from "../../dashboard/processos";

const Page = () => {
  return <ListaProcessos />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
