# Production readiness Deels Web

## Что уже закрыто

- 28 экранов, адаптивные desktop/mobile состояния, вертикальная swipe-лента.
- Реальные ID/slug для challenge, story, campaign и public profile.
- Поиск, фильтры, сортировка, пагинация, empty/loading/error states.
- Лайки, комментарии, share tracking, save, follow, battle voting.
- Регистрация с юридическими согласиями, e-mail verification, reset password.
- Auth guard для кабинета, создания и ответа; закрытое поведение при ошибке live API.
- Wallet deposit/withdraw, donation redirect, сообщения, уведомления, настройки и сессии.
- Веб-версии условий, privacy, content, payments и cookie; consent до аналитики.
- Canonical, уникальные metadata, OG/Twitter, JSON-LD, robots, dynamic sitemap, PWA manifest и настоящий 404.
- CSP, HSTS, anti-frame, nosniff, referrer/permissions policy и ограниченный API proxy.

## Обязательные внешние настройки

- [ ] `NEXT_PUBLIC_SITE_URL` указывает на финальный HTTPS-домен.
- [ ] `DEELS_BACKEND_URL` указывает на production Laravel без `/api`.
- [ ] `NEXT_PUBLIC_DEELS_API_MODE=live`.
- [ ] Выбран `cookie` или `bearer`, настроены Sanctum/trusted proxies/secure cookie.
- [ ] Внесены Google/Yandex verification tokens, sitemap отправлен в панели вебмастеров.
- [ ] У Laravel есть опубликованные `title`, `description`, `cover_url`, `updated_at` для SEO.
- [ ] Платёжные return URL и webhook secrets настроены на production; события идемпотентны.
- [ ] Почтовый домен, SPF/DKIM/DMARC и verification/reset шаблоны проверены.
- [ ] Реальные ссылки VK/TG/YT добавлены вместо текстовых плейсхолдеров футера.
- [ ] Юрист сверил веб-редакции документов с утверждёнными DOCX и реквизитами.
- [ ] Подключена аналитика только по событию `deels:consent` со значением `all`.
- [ ] Ошибки Laravel/Worker направлены в production monitoring без персональных данных.

## Smoke matrix перед релизом

| Контур | Проверка | Ожидание |
|---|---|---|
| Public | Каталоги + detail с реальными slug | 200, данные Laravel, уникальные title/canonical |
| SEO | `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, неизвестный URL | 200/200/200/404 |
| Auth | register → verify → login → reset → logout | Полный цикл без demo fallback |
| Content | create → upload → edit → response → vote | ID сохраняется, лимиты и 422 видны |
| Social | like/unlike, comment, save, follow, share | Повторные клики идемпотентны |
| Money | donate, deposit, withdraw, cancel/return webhook | Сумма сверена сервером, статус обновился |
| Account | profile/avatar, preferences false/true, password, sessions | Изменения переживают reload |
| Messaging | dialogs, thread, send, notification read-all | Данные актуальны и доступны на mobile |
| Security | CSP/HSTS/anti-frame, 401/403/413/422/5xx | Без утечки demo/private данных |
| Accessibility | keyboard, focus, labels, reduced motion, 320 px | Основные сценарии выполняются без мыши |

## Команды релиза

```bash
npm ci
npm run lint
npm test
npm run validate:artifact
```

`npm test` сам собирает production artifact и запускает интеграционные проверки SEO, заголовков, API-централизации и закрытых маршрутов.
