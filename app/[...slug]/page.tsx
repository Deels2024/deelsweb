import { DeelsApp } from "../components/deels-app";

export default async function RoutedPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return <DeelsApp initialPath={`/${slug.join("/")}`} />;
}
