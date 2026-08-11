import type { Metadata } from "next";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://deels.ru").replace(/\/$/, "");
export const siteName = "Deels";
export const defaultTitle = "Deels — челленджи, короткие видео и добрые дела";
export const defaultDescription =
  "Создавайте челленджи, снимайте вертикальные видео, участвуйте в баттлах, голосуйте и поддерживайте проверенные копилки в социальной сети Deels.";

const privatePrefixes = [
  "/profile",
  "/wallet",
  "/messages",
  "/notifications",
  "/settings",
  "/create",
  "/edit",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/screens",
  "/search",
];

const staticSeo: Record<string, { title: string; description: string; keywords: string[] }> = {
  "/": {
    title: defaultTitle,
    description: defaultDescription,
    keywords: ["Deels", "челленджи", "видеочелленджи", "короткие видео", "баттлы", "социальная сеть"],
  },
  "/challenges": {
    title: "Челленджи Deels — участвуйте, снимайте видео и побеждайте",
    description: "Актуальные творческие, спортивные, музыкальные и социальные челленджи. Выберите вызов, снимите ответ и соберите голоса.",
    keywords: ["челленджи", "конкурсы видео", "видеочеллендж", "челленджи с призами"],
  },
  "/feed": {
    title: "Лента коротких видео Deels",
    description: "Вертикальная лента ответов на челленджи, историй и баттлов Deels. Смотрите, голосуйте и находите новые идеи.",
    keywords: ["короткие видео", "вертикальная лента", "видео ответы", "Deels"],
  },
  "/battles": {
    title: "Видео-баттлы Deels — выбирайте лучший ответ",
    description: "Смотрите пары видеоответов и голосуйте за сильнейших участников челленджей Deels.",
    keywords: ["видео баттлы", "голосование", "баттлы Deels"],
  },
  "/stories": {
    title: "Истории Deels — реальные люди и важные перемены",
    description: "Честные вертикальные видео о творчестве, победах и переменах, которыми хочется делиться.",
    keywords: ["истории людей", "видео истории", "мотивация", "Deels"],
  },
  "/campaigns": {
    title: "Проверенные копилки Deels — поддержать сбор",
    description: "Прозрачные сборы людей и организаций с проверкой документов, прогрессом и отчётами.",
    keywords: ["сбор средств", "копилки", "помощь", "благотворительность", "Deels"],
  },
  "/about-us": {
    title: "О Deels — социальная сеть идей и челленджей",
    description: "Миссия, ценности и принципы Deels — платформы, где идея превращается в движение.",
    keywords: ["о Deels", "социальная сеть", "платформа челленджей"],
  },
  "/contact-us": {
    title: "Контакты Deels",
    description: "Поддержка пользователей, сотрудничество и официальные реквизиты владельца платформы Deels.",
    keywords: ["контакты Deels", "поддержка Deels", "ООО КТС-ИМПОРТ"],
  },
  "/offer": {
    title: "Правила, оферта и политика конфиденциальности Deels",
    description: "Условия использования Deels, правила контента, конфиденциальность, платежи, призы и возвраты.",
    keywords: ["правила Deels", "оферта Deels", "политика конфиденциальности"],
  },
};

function humanize(value: string): string {
  return decodeURIComponent(value)
    .replace(/[-_]+/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

type SeoEntity = { title?: string; description?: string; image?: string; updatedAt?: string };

async function fetchSeoEntity(kind: "challenges" | "stories" | "campaigns", id: string): Promise<SeoEntity | null> {
  const backend = process.env.DEELS_BACKEND_URL?.replace(/\/$/, "");
  if (!backend) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2_500);
  try {
    const response = await fetch(`${backend}/api/${kind}/${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as Record<string, unknown>;
    const raw = (payload.data || payload.result || payload) as Record<string, unknown>;
    const media = (raw.media || raw.cover || raw.image || {}) as Record<string, unknown>;
    return {
      title: String(raw.title || raw.name || ""),
      description: String(raw.description || raw.short_description || raw.text || ""),
      image: String(media.url || raw.cover_url || raw.image_url || ""),
      updatedAt: String(raw.updated_at || raw.published_at || ""),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function isPrivatePath(path: string): boolean {
  return privatePrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export async function buildPageMetadata(path: string): Promise<Metadata> {
  const normalized = path.replace(/\/$/, "") || "/";
  const canonical = `${siteUrl}${normalized === "/" ? "" : normalized}`;
  let entry = staticSeo[normalized];
  let entity: SeoEntity | null = null;
  const entityMatch = normalized.match(/^\/(challenges|stories|campaigns)\/([^/]+)$/);

  if (entityMatch) {
    const kind = entityMatch[1] as "challenges" | "stories" | "campaigns";
    const id = entityMatch[2];
    entity = await fetchSeoEntity(kind, id);
    const label = kind === "challenges" ? "Челлендж" : kind === "stories" ? "История" : "Копилка";
    const name = entity?.title || humanize(id);
    entry = {
      title: `${name} — ${label} в Deels`,
      description:
        entity?.description ||
        `${label} «${name}» в Deels. Смотрите, участвуйте и делитесь с друзьями.`,
      keywords: [name, label.toLowerCase(), "Deels"],
    };
  }

  const legalMatch = normalized.match(/^\/documents\/(terms|privacy|content|payments|cookies)$/);
  if (legalMatch) {
    const labels: Record<string, string> = {
      terms: "Условия использования Deels",
      privacy: "Политика конфиденциальности Deels",
      content: "Правила сообщества и контента Deels",
      payments: "Правила платежей, призов и возвратов Deels",
      cookies: "Политика cookie Deels",
    };
    entry = {
      title: labels[legalMatch[1]],
      description: `${labels[legalMatch[1]]}: действующая веб-версия документа, дата редакции и полные условия.`,
      keywords: [labels[legalMatch[1]], "Deels", "правила платформы"],
    };
  }

  const userMatch = normalized.match(/^\/users\/([^/]+)$/);
  if (userMatch) {
    const name = humanize(userMatch[1]);
    entry = {
      title: `${name} — профиль автора в Deels`,
      description: `Профиль @${userMatch[1]}, публикации и челленджи автора в Deels.`,
      keywords: [name, userMatch[1], "автор Deels"],
    };
  }

  entry ||= {
    title: "Deels",
    description: defaultDescription,
    keywords: ["Deels"],
  };

  const noIndex = isPrivatePath(normalized);
  const image = entity?.image || `${siteUrl}/og-cover.svg`;

  return {
    title: entry.title,
    description: entry.description,
    keywords: entry.keywords,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false, noarchive: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: entityMatch ? "article" : "website",
      locale: "ru_RU",
      siteName,
      url: canonical,
      title: entry.title,
      description: entry.description,
      images: [{ url: image, width: 1200, height: 630, alt: entry.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
      images: [image],
    },
    other: {
      "apple-itunes-app": "app-id=6480409656",
      "content-language": "ru-RU",
    },
  };
}

export async function structuredDataForPath(path: string): Promise<Record<string, unknown>[]> {
  const normalized = path.replace(/\/$/, "") || "/";
  const canonical = `${siteUrl}${normalized === "/" ? "" : normalized}`;
  const data: Record<string, unknown>[] = [];

  if (normalized === "/") {
    data.push(
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Deels",
        legalName: "ООО «КТС-ИМПОРТ»",
        url: siteUrl,
        logo: `${siteUrl}/favicon.svg`,
        email: "info@deels.ru",
        telephone: "+7-812-507-98-08",
        address: {
          "@type": "PostalAddress",
          addressCountry: "RU",
          addressLocality: "Санкт-Петербург",
          streetAddress: "пр. Ветеранов, 166, лит. А",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "info@deels.ru",
          telephone: "+7-812-507-98-08",
          availableLanguage: ["ru"],
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteName,
        url: siteUrl,
        inLanguage: "ru-RU",
        publisher: { "@id": `${siteUrl}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Deels",
        applicationCategory: "SocialNetworkingApplication",
        operatingSystem: "Web, iOS, Android",
        url: siteUrl,
        downloadUrl: "https://apps.apple.com/app/id6480409656",
        offers: { "@type": "Offer", price: "0", priceCurrency: "RUB" },
      },
    );
  }

  const match = normalized.match(/^\/(challenges|stories|campaigns)\/([^/]+)$/);
  if (match) {
    const kind = match[1] as "challenges" | "stories" | "campaigns";
    const id = match[2];
    const entity = await fetchSeoEntity(kind, id);
    const title = entity?.title || humanize(id);
    data.push({
      "@context": "https://schema.org",
      "@type": kind === "campaigns" ? "DonateAction" : "VideoObject",
      name: title,
      description: entity?.description || defaultDescription,
      url: canonical,
      ...(kind === "campaigns"
        ? {
            target: canonical,
            recipient: { "@type": "Organization", name: "Deels" },
          }
        : {
            thumbnailUrl: [entity?.image || `${siteUrl}/og-cover.svg`],
            uploadDate: entity?.updatedAt || "2026-08-10",
            contentUrl: canonical,
          }),
    });
  }

  if (["/challenges", "/stories", "/campaigns", "/battles", "/feed"].includes(normalized)) {
    const entry = staticSeo[normalized];
    data.push({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: entry?.title || "Deels",
      description: entry?.description || defaultDescription,
      url: canonical,
      isPartOf: { "@id": `${siteUrl}/#website` },
      inLanguage: "ru-RU",
    });
  }

  const userMatch = normalized.match(/^\/users\/([^/]+)$/);
  if (userMatch) {
    data.push({
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url: canonical,
      mainEntity: {
        "@type": "Person",
        name: humanize(userMatch[1]),
        alternateName: `@${userMatch[1]}`,
        url: canonical,
      },
    });
  }

  if (normalized === "/offer" || normalized.startsWith("/documents/")) {
    data.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Правила и документы Deels",
      url: canonical,
      dateModified: "2026-08-10",
      inLanguage: "ru-RU",
      publisher: { "@id": `${siteUrl}/#organization` },
    });
  }

  if (normalized !== "/") {
    const segments = normalized.split("/").filter(Boolean);
    data.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: siteUrl },
        ...segments.map((segment, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: humanize(segment),
          item: `${siteUrl}/${segments.slice(0, index + 1).join("/")}`,
        })),
      ],
    });
  }

  return data;
}
