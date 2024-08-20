"use client";

import { Layout as DashboardLayout } from "../../../../layouts/dashboard";
import { useRouter } from "next/router";
import DetalhesClienteDash from "../../../dashboard/clientes/detalhes";

function Page() {
  const router = useRouter();

  const customerId = router.query.id ?? "";

  return (
    <>
      <DetalhesClienteDash userId={customerId.toString()} />
    </>
  );
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
