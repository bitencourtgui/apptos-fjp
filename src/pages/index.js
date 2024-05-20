import Head from "next/head";
import { usePageView } from "../hooks/use-page-view";
import { Layout as AuthLayout } from "../layouts/auth/classic-layout";

import LoginFirebase from "./auth/firebase/login";

const Page = () => {
  usePageView();

  return (
    <>
      <Head>
        <title>FJP Consultoria</title>
      </Head>
      <main>
        <LoginFirebase />
      </main>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
