import { usePageView } from "../../../../hooks/use-page-view";
import { Layout as DashboardLayout } from "../../../../layouts/dashboard";

const Page = () => {
  usePageView();


  return <></>
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
