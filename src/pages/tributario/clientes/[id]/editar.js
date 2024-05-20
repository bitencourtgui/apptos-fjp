import { Layout as DashboardLayout } from "../../../../layouts/dashboard";
import EditarClienteDash from "../../../dashboard/clientes/editar";
import { useRouter } from "next/router";

const Page = () => {
  const router = useRouter();
  const customerId = router.query.id ?? "";

  return <EditarClienteDash userId={customerId} />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
