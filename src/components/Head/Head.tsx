import Head from "next/head";

export const HeadComp = ({ page }: { page: string }) => {
  return (
    <Head>
      <title>{page} | FJP</title>
    </Head>
  );
};
