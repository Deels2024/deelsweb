# Подключение Laravel-бэкенда Deels

Интерфейс отделён от Laravel единым адаптером. Экраны не содержат адресов API и не зависят от старых названий полей: URI меняются в `app/lib/api/endpoints.ts`, преобразования ответов — в `app/lib/api/mappers.ts`.

## Режимы запуска

1. Скопируйте `.env.example` в `.env.local`.
2. Укажите `DEELS_BACKEND_URL` без `/api` в конце.
3. Для первого прогона используйте `NEXT_PUBLIC_DEELS_API_MODE=auto`: при недоступном публичном методе интерфейс покажет demo и явное предупреждение.
4. После контрактных тестов переключите `NEXT_PUBLIC_DEELS_API_MODE=live`. В этом режиме защищённые разделы закрываются при сбое авторизации и не показывают demo-контент.

Публичный браузер обращается только к `/api/deels/*`. Same-origin proxy добавляет forwarding-заголовки, передаёт cookie, ограничивает тело 250 МБ, запрещает кэш и нормализует upstream redirect/cookie.

## Карта контрактов

| Возможность | Метод интерфейса | Laravel URI по умолчанию |
|---|---|---|
| Вход, регистрация, выход | `auth.login/register/logout` | `POST /api/auth/login`, `/register`, `/logout` |
| Вход через VK | `auth.oauthUrl` | `GET /api/auth/oauth/vk/redirect` |
| Сброс и подтверждение e-mail | `auth.forgotPassword/resetPassword/verifyEmail/resendVerification` | `/api/auth/forgot-password`, `/reset-password`, `/verify-email/{token}`, `/email/verification-notification` |
| Текущий пользователь | `auth.me`, `profile.me/update/uploadAvatar` | `GET /api/user`, `GET/PATCH /api/profile`, `POST /api/profile/avatar` |
| Челленджи | `challenges.list/detail/create/update/save/join/vote` | `/api/challenges`, `/api/challenges/{id}`, `/save`, `/responses`, `/api/challenge-responses/{id}/vote` |
| Лента и реакции | `feed.list`, `social.like/unlike/comment/share/follow` | `/api/feed`, `/api/{type}/{id}/like|comments|share`, `/api/users/{id}/follow` |
| Баттлы | `battles.list/vote` | `GET /api/battles`, `POST /api/battles/{id}/vote` |
| Истории | `stories.list/detail/create` | `/api/stories`, `/api/stories/{id}` |
| Копилки | `campaigns.list/detail/create/donate` | `/api/campaigns`, `/api/campaigns/{id}`, `/donations` |
| Публичные профили | `users.detail/content` | `/api/users/{id}`, `/api/users/{id}/content` |
| Кошелёк | `wallet.summary/deposit/withdraw` | `GET /api/wallet`, `POST /api/wallet/deposit`, `/withdraw` |
| Сообщения | `messages.dialogs/thread/send` | `/api/messages/dialogs`, `/dialogs/{id}`, `/dialogs/{id}/messages` |
| Уведомления | `notifications.list/read/readAll` | `/api/notifications`, `/{id}/read`, `/read-all` |
| Настройки | `settings.updatePreferences/changePassword/closeOtherSessions` | `/api/settings/preferences`, `/password`, `/sessions/close-others` |
| Поиск и поддержка | `search.all`, `contacts.send` | `GET /api/search?q=`, `POST /api/contacts` |
| Публичная статистика | `stats.summary` | `GET /api/stats` |

Все адреса — начальная карта. Если существующий Laravel использует другие URI, меняйте только `endpoints.ts`.

## Форматы ответа

Списки принимают массив, `{data: [...], meta: {total}}`, `{data: {items: [...]}}` или `{result: {items: [...]}}`. Мапперы понимают пары:

- `slug | uuid | id`;
- `title | name`, `description | text`;
- `author | user | owner | organizer`;
- `prize_fund | prize_amount`, `participants_count | responses_count`;
- `goal_amount | target_amount`, `raised_amount | current_amount`.

Ошибка Laravel `{message, errors}` преобразуется в `ApiError`. Статусы 401/403/404/422/5xx получают понятный текст; запросы обрываются по таймауту.

## Авторизация

Для Sanctum/session установите `NEXT_PUBLIC_DEELS_AUTH_MODE=cookie`. Перед мутациями клиент вызывает `NEXT_PUBLIC_DEELS_CSRF_PATH`, затем отправляет `credentials: include`.

Для token API установите `bearer`. `access_token` хранится только в `sessionStorage`, добавляется в `Authorization` и удаляется при 401.

Backend должен разрешить credentials и доверять домену веб-приложения. При использовании прокси отдельный CORS для браузера не нужен, но Laravel должен корректно определять trusted proxies и secure cookie.

## Загрузки и платежи

Контент отправляется как `multipart/form-data`: `title`, `description`, `category`, `goal`, `prize`, `ends_at`, `rules`, `media`, `documents[]`. Обновление челленджа — `POST` с `_method=PUT`, совместимо с Laravel multipart.

Ответ `campaigns.donate` или `wallet.deposit` может вернуть `redirect_url | payment_url | checkout_url`; интерфейс перенаправит пользователя к провайдеру. Для production обязательны webhook-идемпотентность, серверная проверка суммы/получателя и allowlist return URL.

## Порядок переключения на live

1. Auth + CSRF + e-mail verification.
2. Публичные каталоги и detail по реальному ID/slug.
3. Реакции, голосование, подписки, поиск.
4. Профиль, настройки, сообщения, уведомления.
5. Upload/создание/ответы.
6. Кошелёк, донаты и webhooks.
7. SEO-fetch и динамический sitemap с тем же backend URL.
8. `npm run lint && npm test`, затем smoke-тест матрицы из `PRODUCTION_READINESS.md`.
