import { DeelsApp } from "./components/deels-app";
import { StructuredData } from "./components/structured-data";
import { buildPageMetadata, structuredDataForPath } from "./lib/seo";

export const generateMetadata = () => buildPageMetadata("/");

export default async function Home() {
  const data = await structuredDataForPath("/");
  return (
    <>
      <StructuredData data={data} />
      <DeelsApp initialPath="/" />
    </>
  );
}
