# Deels Web — production-ready новый дизайн

Адаптивный веб-контур Deels: 28 основных экранов, публичные каталоги и detail-страницы, вертикальная лента, баттлы, копилки, личный кабинет, сообщения, платежные действия и создание контента. Светлая тема `light_theme / light_there` сохранена.

## Запуск

```bash
npm ci
cp .env.example .env.local
npm run dev
```

По умолчанию работает безопасный `demo`. Для существующего Laravel укажите `DEELS_BACKEND_URL`, включите `auto` для контрактной проверки, затем `live` для production.

## Архитектура

- `app/components/deels-app.tsx` — маршрутизация экранов и интерактивные сценарии;
- `app/lib/api/` — конфиг, endpoint map, клиент, мапперы, сервисы и hooks;
- `app/api/deels/[...path]/route.ts` — защищённый same-origin proxy к Laravel;
- `app/lib/seo.ts`, `robots.ts`, `sitemap.ts`, `manifest.ts` — SEO/PWA слой;
- `app/lib/legal.ts` — веб-версии юридических документов;
- `worker/index.ts` — Cloudflare entrypoint и security headers;
- `docs/BACKEND_INTEGRATION.md` — полный контракт подключения Laravel;
- `docs/PRODUCTION_READINESS.md` — внешний checklist и smoke matrix.

## Проверка

```bash
npm run lint
npm test
npm run validate:artifact
```
