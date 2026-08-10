# Подключение существующего бэкенда Deels

Новый интерфейс отделён от Laravel единым адаптером: 26 экранов не знают реальные URI и старые имена полей.

## Быстрый запуск

1. Скопировать `.env.example` в `.env.local`.
2. Указать `DEELS_BACKEND_URL` без `/api`.
3. Сверить URI в `app/lib/api/endpoints.ts`; несовпавший адрес меняется только там.
4. Включить `NEXT_PUBLIC_DEELS_API_MODE=auto` и подключать методы по очереди.
5. После проверки переключить режим на `live`, чтобы ошибки сервера не маскировались demo-данными.

## Слои интеграции

- `config.ts` — режим, URL, авторизация и таймаут;
- `endpoints.ts` — все адреса старого API;
- `client.ts` — cookies/Bearer, CSRF, таймаут, Laravel 422 и единые ошибки;
- `mappers.ts` — преобразование `snake_case` и старых вложенных объектов в модели дизайна;
- `services.ts` — методы, вызываемые экранами;
- `hooks.ts` — загрузка с режимами `demo/auto/live`;
- `app/api/deels/[...path]/route.ts` — прокси без CORS.

## Карта методов

| Экран/действие | Сервис | URI по умолчанию |
|---|---|---|
| Челленджи | `challenges.list/detail/create/update` | `GET/POST /api/challenges`, `GET/POST /api/challenges/{id}` |
| Голос за ответ | `challenges.vote` | `POST /api/challenge-responses/{id}/vote` |
| Лента, баттлы | `endpoints.feed/battles` | `GET /api/feed`, `GET /api/battles` |
| Истории | `stories.list/detail/create` | `GET/POST /api/stories` |
| Копилки и поддержка | `campaigns.*` | `GET/POST /api/campaigns`, `POST /api/campaigns/{id}/donations` |
| Вход/регистрация/выход | `auth.*` | `/api/auth/login`, `/register`, `/logout` |
| Пользователь | `auth.me`, `profile.*` | `GET /api/user`, `GET/PATCH /api/profile` |
| Кошелёк | `wallet.*` | `GET /api/wallet`, `POST /api/wallet/withdraw` |
| Сообщения | `messages.*` | `GET /api/messages/dialogs`, `POST /api/messages/dialogs/{id}/messages` |
| Уведомления | `notifications.*` | `GET /api/notifications` |
| Поиск | `search.all` | `GET /api/search?q=...` |
| Обратная связь | `contacts.send` | `POST /api/contacts` |

Списки понимают массив, `{data: [...], meta: {total}}` и `{result: {items: [...]}}`. Мапперы уже учитывают пары `slug/uuid/id`, `title/name`, `author/user/owner`, `prize_fund/prize_amount`, `participants_count/responses_count`, `goal_amount/target_amount`, `raised_amount/current_amount`.

## Авторизация

Для Sanctum/session: `NEXT_PUBLIC_DEELS_AUTH_MODE=cookie`. Клиент получает CSRF-cookie и отправляет `credentials: include`; прокси убирает чужой `Domain` у cookie.

Для token API: `NEXT_PUBLIC_DEELS_AUTH_MODE=bearer`. Ответ входа может содержать `access_token` или `token`; значение хранится в `sessionStorage`, добавляется в `Authorization` и удаляется при 401.

## Запись и файлы

Обычные формы идут JSON. Создание контента — `multipart/form-data`: `title`, `description`, `category`, `goal`, `prize`, `ends_at`, `rules`, `media`, `documents[]`. Обновление отправляется как `POST + _method=PUT`, совместимо с Laravel multipart.

Рекомендуемый порядок: авторизация → публичные каталоги → профиль/сообщения → загрузка и создание → кошелёк и платежи → режим `live`.
