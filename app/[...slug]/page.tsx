import { DeelsApp } from "../components/deels-app";
import { StructuredData } from "../components/structured-data";
import { buildPageMetadata, structuredDataForPath } from "../lib/seo";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string[] }> };

async function pathFrom(params: Props["params"]): Promise<string> {
  const { slug } = await params;
  return `/${slug.join("/")}`;
}

const staticPaths = new Set([
  "/challenges", "/feed", "/battles", "/stories", "/campaigns",
  "/about-us", "/contact-us", "/offer", "/login", "/register",
  "/forgot-password", "/reset-password", "/profile", "/wallet",
  "/messages", "/notifications", "/search", "/settings", "/create",
  "/create/challenge", "/create/story", "/create/campaign", "/screens",
]);

function isKnownPath(path: string): boolean {
  return staticPaths.has(path) || [
    /^\/challenges\/[^/]+$/,
    /^\/challenges\/[^/]+\/respond$/,
    /^\/stories\/[^/]+$/,
    /^\/campaigns\/[^/]+$/,
    /^\/users\/[^/]+$/,
    /^\/verify-email\/[^/]+$/,
    /^\/edit\/challenge\/[^/]+$/,
    /^\/documents\/(terms|privacy|content|payments|cookies)$/,
  ].some((pattern) => pattern.test(path));
}

export async function generateMetadata({ params }: Props) {
  return buildPageMetadata(await pathFrom(params));
}

export default async function RoutedPage({ params }: Props) {
  const path = await pathFrom(params);
  if (!isKnownPath(path)) notFound();
  const data = await structuredDataForPath(path);
  return (
    <>
      <StructuredData data={data} />
      <DeelsApp initialPath={path} />
    </>
  );
}
