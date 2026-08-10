# Deels Web — новый дизайн

Полный адаптивный веб-контур Deels: 26 экранов, единая светлая тема, публичные разделы, личный кабинет и создание контента. Проект подготовлен для поэтапного подключения существующего Laravel-бэкенда без переделки вёрстки.

## Запуск

```bash
npm ci
cp .env.example .env.local
npm run dev
```

По умолчанию включён `demo`. Для Laravel укажите `DEELS_BACKEND_URL` и переключите `NEXT_PUBLIC_DEELS_API_MODE=auto`, после проверки — `live`.

## Где что находится

- `app/styles.css`, `app/pages.css`, `app/themes/deels-main.css` — сетка, страницы и тема `light_theme / light_there`;
- `app/lib/api/` — API-клиент, эндпоинты, мапперы, сервисы и hooks;
- `app/api/deels/[...path]/route.ts` — same-origin прокси к Laravel;
- `docs/BACKEND_INTEGRATION.md` — пошаговое подключение всех функций.

Проверка: `npm run lint && npm test`.
