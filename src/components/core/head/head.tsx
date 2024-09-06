import Head from "next/head";

const HeadComponent = ({ page }: { page: string }) => {
  return (
    <Head>
      <title>{page} | FJP</title>
    </Head>
  );
};

export { HeadComponent as Head };
