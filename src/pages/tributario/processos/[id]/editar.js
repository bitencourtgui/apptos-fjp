import { usePageView } from "../../../../hooks/use-page-view";
import { Layout as DashboardLayout } from "../../../../layouts/dashboard";
import { useRouter } from "next/router";
import EditarProcessoDash from "../../../dashboard/processos/editar";

const Page = () => {
  usePageView();

  const router = useRouter();
  const customerId = router.query.id ?? "";

  return <EditarProcessoDash userId={customerId} />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
