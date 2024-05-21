import { usePageView } from "../../../../hooks/use-page-view";
import { Layout as DashboardLayout } from "../../../../layouts/dashboard";
import { useRouter } from "next/router";

const Page = () => {
  usePageView();

  const router = useRouter();
  const customerId = router.query.id ?? "";

  return <></>;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
