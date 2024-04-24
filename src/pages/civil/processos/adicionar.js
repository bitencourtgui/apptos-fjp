import { usePageView } from "../../../hooks/use-page-view";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import { useRouter } from "next/router";
import AdicionarProcessos from "../../dashboard/processos/adicionar";

const Page = () => {
  usePageView();

  const router = useRouter();

  const { customerId } = router.query;

  return <AdicionarProcessos userId={customerId} />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
