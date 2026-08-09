"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";

type Challenge = {
  id: string;
  title: string;
  author: string;
  prize: string;
  participants: string;
  tag: string;
  emoji: string;
  tone: string;
};

const challenges: Challenge[] = [
  { id: "summer-move", title: "Повтори летний движ", author: "deels.team", prize: "50 000 ₽", participants: "1,2K", tag: "Танцы", emoji: "🕺", tone: "violet" },
  { id: "kindness-chain", title: "Цепочка добрых дел", author: "mila.sun", prize: "25 000 ₽", participants: "846", tag: "Добро", emoji: "🤍", tone: "coral" },
  { id: "city-frame", title: "Мой город за 15 секунд", author: "urban.day", prize: "30 000 ₽", participants: "734", tag: "Творчество", emoji: "🏙️", tone: "blue" },
  { id: "voice-up", title: "Твой голос — твоя сила", author: "voiceclub", prize: "15 000 ₽", participants: "590", tag: "Музыка", emoji: "🎤", tone: "pink" },
  { id: "family-recipe", title: "Семейный рецепт", author: "food.room", prize: "20 000 ₽", participants: "428", tag: "Еда", emoji: "🥣", tone: "lime" },
  { id: "pet-star", title: "Звезда моего дома", author: "pets.deels", prize: "10 000 ₽", participants: "1,8K", tag: "Питомцы", emoji: "🐕", tone: "orange" },
];

const stories = [
  { id: "dance-with-me", title: "Танец, который вернул уверенность", author: "Алина М.", time: "2 мин", emoji: "✨", tone: "pink" },
  { id: "first-stage", title: "Как я впервые вышел на сцену", author: "Илья С.", time: "4 мин", emoji: "🎭", tone: "blue" },
  { id: "new-city", title: "Новый город и 100 новых друзей", author: "Саша К.", time: "3 мин", emoji: "🛹", tone: "orange" },
  { id: "little-win", title: "Моя маленькая большая победа", author: "Вика Д.", time: "2 мин", emoji: "🏆", tone: "violet" },
];

const campaigns = [
  { id: "help-masha", title: "Поможем Маше снова танцевать", raised: 78, sum: "1 564 300 ₽", goal: "2 000 000 ₽", emoji: "💜", tone: "violet" },
  { id: "creative-yard", title: "Творческий двор для подростков", raised: 64, sum: "641 200 ₽", goal: "1 000 000 ₽", emoji: "🎨", tone: "coral" },
  { id: "animal-home", title: "Тёплый дом для 40 хвостов", raised: 91, sum: "819 000 ₽", goal: "900 000 ₽", emoji: "🐾", tone: "blue" },
];

const screenGroups = [
  { title: "Публичные страницы", items: [["Главная", "/"], ["Челленджи", "/challenges"], ["Карточка челленджа", "/challenges/summer-move"], ["Лента", "/feed"], ["Баттлы", "/battles"], ["Истории", "/stories"], ["Карточка истории", "/stories/dance-with-me"], ["Копилки", "/campaigns"], ["Карточка копилки", "/campaigns/help-masha"], ["О проекте", "/about-us"], ["Контакты", "/contact-us"], ["Документы", "/offer"]] },
  { title: "Вход и профиль", items: [["Войти", "/login"], ["Регистрация", "/register"], ["Восстановление пароля", "/forgot-password"], ["Профиль", "/profile"], ["Кошелёк", "/wallet"], ["Сообщения", "/messages"], ["Уведомления", "/notifications"], ["Поиск", "/search"], ["Настройки", "/settings"]] },
  { title: "Создание", items: [["Выбор формата", "/create"], ["Новый челлендж", "/create/challenge"], ["Новая история", "/create/story"], ["Новая копилка", "/create/campaign"], ["Редактирование", "/edit/challenge"]] },
];

function Icon({ name }: { name: string }) {
  const icons: Record<string, string> = { home: "⌂", search: "⌕", plus: "+", bell: "◌", user: "●", play: "▶", arrow: "→", heart: "♡", comment: "◯", share: "↗", wallet: "₽", menu: "≡", close: "×", check: "✓", more: "•••", back: "←", fire: "↗", spark: "✦", message: "✉", settings: "⚙" };
  return <span className={`icon icon-${name}`} aria-hidden="true">{icons[name] ?? "•"}</span>;
}

function A({ href, className = "", children }: { href: string; className?: string; children: ReactNode }) {
  return <a className={className} href={href}>{children}</a>;
}

function Brand() {
  return <A href="/" className="brand" aria-label="Deels — главная"><span className="brand-mark">D</span><span className="brand-word">DEELS</span></A>;
}

function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <button className="icon-button mobile-menu-button" onClick={onMenu} aria-label="Открыть меню"><Icon name="menu" /></button>
        <Brand />
        <nav className="desktop-nav" aria-label="Основная навигация">
          <A href="/feed">Лента</A><A href="/challenges">Челленджи</A><A href="/battles">Баттлы</A><A href="/stories">Истории</A><A href="/campaigns">Копилки</A>
        </nav>
        <div className="header-actions">
          <A href="/search" className="icon-button"><Icon name="search" /></A>
          <A href="/notifications" className="icon-button desktop-only"><Icon name="bell" /><span className="notification-dot" /></A>
          <A href="/create" className="button button-primary button-small"><Icon name="plus" /> Создать</A>
          <A href="/profile" className="avatar avatar-small desktop-only">СС</A>
        </div>
      </div>
    </header>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <><button className={`drawer-scrim ${open ? "is-open" : ""}`} onClick={onClose} aria-label="Закрыть меню" /><aside className={`mobile-drawer ${open ? "is-open" : ""}`}><div className="drawer-head"><Brand /><button className="icon-button" onClick={onClose}><Icon name="close" /></button></div><nav>{[["Лента", "/feed"], ["Челленджи", "/challenges"], ["Баттлы", "/battles"], ["Истории", "/stories"], ["Копилки", "/campaigns"], ["Профиль", "/profile"], ["Все экраны", "/screens"]].map(([label, href]) => <A key={href} href={href}>{label}<Icon name="arrow" /></A>)}</nav><A href="/create" className="button button-primary">Создать в Deels</A></aside></>;
}

function MobileNav({ path }: { path: string }) {
  const items = [["home", "Главная", "/"], ["search", "Поиск", "/search"], ["plus", "Создать", "/create"], ["bell", "События", "/notifications"], ["user", "Профиль", "/profile"]];
  return <nav className="mobile-bottom-nav">{items.map(([icon, label, href]) => <A key={href} href={href} className={`${path === href ? "active" : ""} ${href === "/create" ? "create-nav" : ""}`}><Icon name={icon} /><span>{label}</span></A>)}</nav>;
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div><Brand /><p>Новая развлекательная соцсеть, где идеи превращаются в движение.</p><div className="socials"><span>VK</span><span>TG</span><span>YT</span></div></div><div><h4>Смотреть</h4><A href="/feed">Лента</A><A href="/challenges">Челленджи</A><A href="/stories">Истории</A><A href="/campaigns">Копилки</A></div><div><h4>Deels</h4><A href="/about-us">О проекте</A><A href="/contact-us">Контакты</A><A href="/offer">Документы</A><A href="/screens">Карта экранов</A></div><div><h4>Будь в движении</h4><p>Скачивай приложение и участвуй первым.</p><div className="store-buttons"><span>App Store</span><span>Google Play</span></div></div></div><div className="container footer-bottom"><span>© 2026 Deels</span><span>Сделано для настоящих идей</span></div></footer>;
}

function PageShell({ path, children, minimal = false, standalone = false }: { path: string; children: ReactNode; minimal?: boolean; standalone?: boolean }) {
  const [drawer, setDrawer] = useState(false);
  return <div className="deels-app light_theme light_there">{!standalone && <><Header onMenu={() => setDrawer(true)} /><MobileDrawer open={drawer} onClose={() => setDrawer(false)} /></>}{children}{!minimal && !standalone && <Footer />}{!standalone && <MobileNav path={path} />}</div>;
}

function SectionHead({ eyebrow, title, text, link }: { eyebrow?: string; title: string; text?: string; link?: string }) {
  return <div className="section-head"><div>{eyebrow && <span className="eyebrow"><Icon name="spark" /> {eyebrow}</span>}<h2>{title}</h2>{text && <p>{text}</p>}</div>{link && <A href={link} className="text-link">Смотреть все <Icon name="arrow" /></A>}</div>;
}

function ChallengeCard({ item, compact = false }: { item: Challenge; compact?: boolean }) {
  return <article className={`video-card ${compact ? "compact" : ""}`}><A href={`/challenges/${item.id}`} className={`poster poster-${item.tone}`}><div className="poster-top"><span className="poster-tag">{item.tag}</span><span className="round-action" aria-label="Сохранить"><Icon name="heart" /></span></div><span className="poster-emoji">{item.emoji}</span><div className="poster-caption"><span>@{item.author}</span><strong>{item.title}</strong></div><span className="play-button"><Icon name="play" /></span></A><div className="card-meta"><div><strong>{item.prize}</strong><span>призовой фонд</span></div><div><strong>{item.participants}</strong><span>участников</span></div></div></article>;
}

function StoryCard({ item }: { item: typeof stories[number] }) {
  return <A href={`/stories/${item.id}`} className={`story-card poster-${item.tone}`}><div className="story-icon">{item.emoji}</div><div><span>{item.time} • @{item.author}</span><h3>{item.title}</h3><span className="story-more">Смотреть историю <Icon name="arrow" /></span></div></A>;
}

function CampaignCard({ item }: { item: typeof campaigns[number] }) {
  return <article className="campaign-card"><A href={`/campaigns/${item.id}`} className={`campaign-cover poster-${item.tone}`}><span>{item.emoji}</span><span className="poster-tag">Проверенная копилка</span></A><div className="campaign-body"><h3>{item.title}</h3><div className="progress-line"><span style={{ width: `${item.raised}%` }} /></div><div className="progress-meta"><strong>{item.sum}</strong><span>из {item.goal}</span></div><A href={`/campaigns/${item.id}`} className="button button-soft">Поддержать</A></div></article>;
}

function HomePage() {
  return <PageShell path="/"><main><section className="hero theme-gradient"><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow"><Icon name="spark" /> Здесь начинается движение</span><h1>Твоя идея<br />может стать <em>движением</em></h1><p>Создавай челленджи, снимай ответы, участвуй в баттлах и поддерживай истории, которые хочется разделить.</p><div className="hero-actions"><A href="/create/challenge" className="button button-primary">Создать челлендж <Icon name="arrow" /></A><A href="/feed" className="button button-glass"><Icon name="play" /> Смотреть ленту</A></div><div className="hero-proof"><div className="avatar-stack"><span>АК</span><span>МС</span><span>ОЛ</span><span>+8K</span></div><p><strong>12 400+</strong><br />уже создают в Deels</p></div></div><div className="hero-visual"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="floating-chip chip-prize"><span>🏆</span><strong>50 000 ₽</strong><small>призовой фонд</small></div><div className="floating-chip chip-trend"><span>↗</span><strong>В тренде</strong><small>1 248 ответов</small></div><div className="phone-frame"><div className="phone-top"><Brand /><Icon name="bell" /></div><div className="phone-video poster-violet"><span className="phone-live">DEELS • LIVE</span><span className="poster-emoji">🕺</span><div className="phone-side"><span><Icon name="heart" /><small>8,2K</small></span><span><Icon name="comment" /><small>462</small></span><span><Icon name="share" /><small>92</small></span></div><div className="phone-caption"><small>@mila.sun</small><strong>Повтори летний движ</strong><span>#танцы #deels</span></div></div><div className="phone-nav"><span>⌂</span><span>⌕</span><b>+</b><span>◌</span><span>●</span></div></div></div></div></section><section className="section"><div className="container"><SectionHead eyebrow="Горячее сейчас" title="Челленджи, о которых говорят" text="Выбирай идею, снимай свой ответ и забирай внимание аудитории." link="/challenges" /><div className="horizontal-cards">{challenges.slice(0, 4).map(item => <ChallengeCard key={item.id} item={item} />)}</div></div></section><section className="section section-dark theme-dark-card"><div className="container"><SectionHead eyebrow="Простая механика" title="От идеи до победы — три шага" text="Никаких сложных правил. Только ты, камера и желание попробовать." /><div className="steps-grid"><article><span>01</span><div className="step-icon">✦</div><h3>Найди свой вызов</h3><p>Выбери челлендж, который тебя цепляет.</p></article><article><span>02</span><div className="step-icon">▶</div><h3>Сними ответ</h3><p>Покажи свой вариант в коротком вертикальном видео.</p></article><article><span>03</span><div className="step-icon">🏆</div><h3>Собери голоса</h3><p>Делись, получай поддержку и выходи в топ.</p></article></div></div></section><section className="section"><div className="container split-feature"><div><SectionHead eyebrow="Истории Deels" title="Не просто видео. Настоящие истории" text="Люди рассказывают о шагах, которые изменили их жизнь. Иногда достаточно одного честного ролика, чтобы вдохновить тысячи." /><A href="/stories" className="button button-dark">Смотреть истории <Icon name="arrow" /></A></div><div className="stories-stack">{stories.slice(0, 3).map(item => <StoryCard key={item.id} item={item} />)}</div></div></section><section className="section section-tint"><div className="container"><SectionHead eyebrow="Делись добром" title="Копилки, которые меняют жизнь" text="Поддерживай проверенные сборы и следи за результатом вместе с сообществом." link="/campaigns" /><div className="campaign-grid">{campaigns.map(item => <CampaignCard key={item.id} item={item} />)}</div></div></section><section className="section"><div className="container cta-card theme-dark-card"><div><span className="eyebrow"><Icon name="spark" /> Твой ход</span><h2>Готов создать то,<br />что подхватят другие?</h2><p>Начни с первого челленджа. Это займёт меньше пяти минут.</p></div><A href="/create" className="button button-white">Создать в Deels <Icon name="arrow" /></A></div></section></main></PageShell>;
}

function CatalogHero({ eyebrow, title, text, children }: { eyebrow: string; title: string; text: string; children?: ReactNode }) {
  return <section className="catalog-hero theme-gradient"><div className="container"><span className="eyebrow"><Icon name="spark" /> {eyebrow}</span><h1>{title}</h1><p>{text}</p>{children}</div></section>;
}

function Filters({ items }: { items: string[] }) {
  const [active, setActive] = useState(items[0]);
  return <div className="filter-row" role="tablist">{items.map(item => <button key={item} className={active === item ? "active" : ""} onClick={() => setActive(item)}>{item}</button>)}</div>;
}

function ChallengesPage() {
  return <PageShell path="/challenges"><main><CatalogHero eyebrow="Выбирай свой вызов" title="Челленджи" text="Тренды, творчество, спорт, музыка и добрые дела — найди идею, которую захочется повторить."><div className="hero-search"><Icon name="search" /><input aria-label="Поиск челленджей" placeholder="Найти челлендж или автора" /><button>Найти</button></div></CatalogHero><section className="section catalog-section"><div className="container"><Filters items={["Все", "В тренде", "С призами", "Новые", "Танцы", "Музыка", "Спорт", "Добро"]} /><div className="catalog-toolbar"><span>Найдено 128 челленджей</span><select aria-label="Сортировка"><option>Сначала популярные</option><option>Сначала новые</option><option>Призовой фонд</option></select></div><div className="catalog-grid">{[...challenges, ...challenges.slice(1, 5)].map((item, index) => <ChallengeCard key={`${item.id}-${index}`} item={item} />)}</div><button className="button button-soft load-more">Показать ещё</button></div></section></main></PageShell>;
}

function ChallengeDetail() {
  return <PageShell path="/challenges"><main><section className="detail-hero"><div className="container detail-grid"><div className="detail-poster poster-violet"><span className="phone-live">В тренде • №1</span><span className="detail-emoji">🕺</span><div className="poster-caption"><span>@deels.team</span><strong>Повтори летний движ</strong><small>#танцы #лето #движ</small></div><span className="play-button big"><Icon name="play" /></span></div><div className="detail-copy"><A href="/challenges" className="back-link"><Icon name="back" /> Все челленджи</A><span className="eyebrow"><Icon name="spark" /> До финала 8 дней</span><h1>Повтори<br />летний движ</h1><p>Покажи свой фирменный летний танец. Сними вертикальное видео до 30 секунд, добавь хэштег и позови друзей голосовать.</p><div className="detail-stats"><div><strong>50 000 ₽</strong><span>призовой фонд</span></div><div><strong>1 248</strong><span>ответов</span></div><div><strong>2,4M</strong><span>просмотров</span></div></div><div className="detail-actions"><A href="/create/challenge" className="button button-primary">Принять участие <Icon name="arrow" /></A><button className="button button-soft"><Icon name="heart" /> Сохранить</button></div></div></div></section><section className="section"><div className="container content-with-aside"><div className="content-card"><h2>Как участвовать</h2><ol className="rules-list"><li><span>1</span><div><strong>Запиши свой танец</strong><p>Один участник — одно вертикальное видео длительностью до 30 секунд.</p></div></li><li><span>2</span><div><strong>Используй оригинальный звук</strong><p>Можно взять звук челленджа или загрузить собственную аудиодорожку.</p></div></li><li><span>3</span><div><strong>Собирай голоса</strong><p>Победителей выберет сообщество и жюри Deels.</p></div></li></ol><h2>Топ ответов</h2><div className="mini-video-grid">{challenges.slice(1, 5).map((item, i) => <div key={item.id} className={`mini-video poster-${item.tone}`}><span className="rank">#{i + 1}</span><span>{item.emoji}</span><small>{["12,4K", "9,8K", "8,2K", "7,9K"][i]} голосов</small></div>)}</div></div><aside className="organizer-card"><span className="avatar">D</span><div><small>Организатор</small><strong>Deels Team</strong><span>@deels.team • ✓</span></div><hr /><p>Создаём челленджи, которые объединяют людей.</p><A href="/profile" className="button button-soft">Открыть профиль</A></aside></div></section></main></PageShell>;
}

function FeedPage() {
  const [slide, setSlide] = useState(0);
  const item = challenges[slide % challenges.length];
  return <PageShell path="/feed" minimal><main className="feed-page"><div className="feed-tabs"><button className="active">Для тебя</button><button>Подписки</button></div><div className="feed-layout"><aside className="feed-side-card"><h3>В тренде</h3>{challenges.slice(0, 4).map((c, i) => <A href={`/challenges/${c.id}`} key={c.id}><span>{i + 1}</span><div><strong>#{c.tag.toLowerCase()}</strong><small>{c.participants} видео</small></div></A>)}</aside><section className={`feed-video poster-${item.tone}`}><div className="phone-top"><Brand /><Icon name="search" /></div><span className="feed-emoji">{item.emoji}</span><div className="phone-side"><button><Icon name="heart" /><small>8,2K</small></button><button><Icon name="comment" /><small>462</small></button><button><Icon name="share" /><small>92</small></button></div><div className="feed-caption"><strong>@{item.author}</strong><h2>{item.title}</h2><p>Покажи свою версию и участвуй в розыгрыше {item.prize}.</p><A href={`/challenges/${item.id}`}>Открыть челлендж <Icon name="arrow" /></A></div><div className="feed-switch"><button onClick={() => setSlide((slide - 1 + challenges.length) % challenges.length)} aria-label="Предыдущее видео">↑</button><button onClick={() => setSlide((slide + 1) % challenges.length)} aria-label="Следующее видео">↓</button></div></section><aside className="feed-side-card"><h3>Продолжить</h3><p>Войди, чтобы сохранять видео, голосовать и подписываться на авторов.</p><A href="/login" className="button button-primary">Войти</A><A href="/register" className="text-link">Создать аккаунт</A></aside></div></main></PageShell>;
}

function BattlesPage() {
  return <PageShell path="/battles"><main><CatalogHero eyebrow="Два ответа — один победитель" title="Баттлы" text="Смотри пары видео и выбирай, чей ответ сильнее. Один голос может изменить финал." /><section className="section"><div className="container"><Filters items={["Сейчас", "Завершённые", "Мои баттлы"]} /><div className="battles-grid">{challenges.slice(0, 3).map((item, i) => <article className="battle-card" key={item.id}><div className="battle-head"><span>Раунд {i + 1} из 5</span><strong>{item.title}</strong><small>осталось {12 + i * 4} ч.</small></div><div className="versus-grid"><button className={`battle-side poster-${item.tone}`}><span>{item.emoji}</span><strong>@{item.author}</strong><small>{52 + i * 3}%</small></button><b>VS</b><button className={`battle-side poster-${challenges[i + 1].tone}`}><span>{challenges[i + 1].emoji}</span><strong>@{challenges[i + 1].author}</strong><small>{48 - i * 3}%</small></button></div><p>1 824 голоса • Нажми на видео, чтобы выбрать</p></article>)}</div></div></section></main></PageShell>;
}

function StoriesPage() {
  return <PageShell path="/stories"><main><CatalogHero eyebrow="Люди и их поворотные моменты" title="Истории" text="Честные видео о маленьких шагах, сильных решениях и переменах, которыми хочется делиться." /><section className="section"><div className="container"><Filters items={["Все истории", "Вдохновение", "Творчество", "Люди", "Путешествия"]} /><div className="stories-catalog">{[...stories, ...stories].map((item, i) => <StoryCard key={`${item.id}-${i}`} item={item} />)}</div></div></section></main></PageShell>;
}

function StoryDetail() {
  return <PageShell path="/stories"><main><section className="story-detail theme-dark-card"><div className="container story-detail-grid"><div className="story-player poster-pink"><span className="phone-live">История • 02:14</span><span className="detail-emoji">✨</span><span className="play-button big"><Icon name="play" /></span></div><div><A href="/stories" className="back-link light"><Icon name="back" /> Все истории</A><span className="eyebrow">Личный опыт</span><h1>Танец, который вернул уверенность</h1><p>«Я год не решалась снова выйти в зал. А потом увидела челлендж в Deels и просто включила камеру…»</p><div className="author-row"><span className="avatar">АМ</span><div><strong>Алина Морозова</strong><span>@alina.moves • Санкт-Петербург</span></div><button className="button button-white button-small">Подписаться</button></div><div className="detail-actions"><button className="button button-glass"><Icon name="heart" /> 12,8K</button><button className="button button-glass"><Icon name="comment" /> 486</button><button className="button button-glass"><Icon name="share" /> Поделиться</button></div></div></div></section><section className="section"><div className="container narrow-copy"><span className="eyebrow">После публикации</span><h2>Историю увидели 340 тысяч человек</h2><p>Алина получила сотни сообщений от людей, которые тоже боялись вернуться к любимому делу. Через месяц она создала собственный челлендж — и теперь помогает другим сделать первый шаг.</p><div className="quote-card">«Иногда камера — не испытание, а разрешение наконец быть собой.»</div></div></section></main></PageShell>;
}

function CampaignsPage() {
  return <PageShell path="/campaigns"><main><CatalogHero eyebrow="Поддержка в одно касание" title="Копилки" text="Проверенные сборы от людей и организаций. Следи за прогрессом и вместе с сообществом приближай цель." /><section className="section"><div className="container"><Filters items={["Все", "Срочные", "Дети", "Животные", "Творчество", "Проекты"]} /><div className="campaign-grid large">{[...campaigns, ...campaigns].map((item, i) => <CampaignCard key={`${item.id}-${i}`} item={item} />)}</div></div></section></main></PageShell>;
}

function CampaignDetail() {
  const [amount, setAmount] = useState("1000");
  return <PageShell path="/campaigns"><main><section className="detail-hero"><div className="container campaign-detail-grid"><div className="campaign-detail-cover poster-violet"><span>💜</span><div><small>Проверенная копилка</small><strong>Каждый шаг<br />имеет значение</strong></div></div><div className="detail-copy"><A href="/campaigns" className="back-link"><Icon name="back" /> Все копилки</A><span className="eyebrow"><Icon name="check" /> Документы проверены Deels</span><h1>Поможем Маше снова танцевать</h1><p>Маше 11 лет, и она мечтает вернуться к занятиям. Средства пойдут на операцию и курс восстановления.</p><div className="progress-line big"><span style={{ width: "78%" }} /></div><div className="campaign-numbers"><div><strong>1 564 300 ₽</strong><span>собрано</span></div><div><strong>2 000 000 ₽</strong><span>цель</span></div></div><div className="donate-box"><div className="amount-row">{["500", "1000", "3000"].map(v => <button className={amount === v ? "active" : ""} onClick={() => setAmount(v)} key={v}>{Number(v).toLocaleString("ru-RU")} ₽</button>)}<label><input value={amount} onChange={e => setAmount(e.target.value)} aria-label="Другая сумма" /><span>₽</span></label></div><button className="button button-primary">Поддержать на {Number(amount || 0).toLocaleString("ru-RU")} ₽</button><small>Безопасная оплата • можно анонимно</small></div></div></div></section><section className="section"><div className="container content-with-aside"><article className="content-card prose"><h2>История Маши</h2><p>Маша занимается танцами с пяти лет. После травмы врачи рекомендовали специальную операцию и длительную реабилитацию. Семья уже прошла большую часть пути, но сейчас нужна поддержка.</p><div className="quote-card">«Я больше всего хочу снова выйти на сцену вместе со своей командой.»</div><h2>На что пойдут средства</h2><p>Операция — 1 240 000 ₽, восстановительный курс — 560 000 ₽, проживание семьи на период лечения — 200 000 ₽.</p></article><aside className="organizer-card"><span className="avatar">ЕМ</span><div><small>Организатор</small><strong>Елена, мама Маши</strong><span>Личность подтверждена • ✓</span></div><hr /><p>Отчёты и новости публикуются каждую неделю.</p><button className="button button-soft"><Icon name="message" /> Написать</button></aside></div></section></main></PageShell>;
}

function AboutPage() {
  return <PageShell path="/about-us"><main><section className="about-hero theme-gradient"><div className="container"><span className="eyebrow"><Icon name="spark" /> О проекте</span><h1>Deels — пространство,<br />где <em>идея объединяет</em></h1><p>Мы строим социальную сеть, в которой ценится не идеальная картинка, а желание участвовать, пробовать и поддерживать друг друга.</p><div className="about-numbers"><div><strong>12,4K</strong><span>авторов</span></div><div><strong>180K</strong><span>видеоответов</span></div><div><strong>8,7M</strong><span>голосов</span></div><div><strong>4,6M ₽</strong><span>в копилках</span></div></div></div></section><section className="section"><div className="container values-grid"><article><span>01</span><h3>Создавать проще</h3><p>Одна идея, одно короткое видео и понятная механика участия.</p></article><article><span>02</span><h3>Поддержка важнее</h3><p>Голосование, честная модерация и сообщество без токсичности.</p></article><article><span>03</span><h3>Результат заметен</h3><p>Призы, новые знакомства, аудитория и реальные добрые дела.</p></article></div></section><section className="section section-tint"><div className="container split-feature"><div><span className="eyebrow">Наша миссия</span><h2>Помочь каждому<br />сделать первый шаг</h2></div><div className="big-copy">Мы верим, что творчество становится сильнее, когда получает отклик. Deels соединяет авторов, зрителей, бренды и социальные проекты вокруг простого действия — <strong>сделать и поделиться.</strong></div></div></section></main></PageShell>;
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  return <PageShell path="/contact-us"><main><CatalogHero eyebrow="Мы на связи" title="Контакты" text="Расскажи о задаче — команда Deels ответит и поможет найти правильный формат." /><section className="section"><div className="container contact-grid"><div className="contact-list"><article><span>Общие вопросы и поддержка</span><a href="mailto:info@deels.ru">info@deels.ru</a><p>О продукте, аккаунте и возможностях платформы.</p></article><article><span>Телефон</span><a href="tel:+78125079808">+7 (812) 507-98-08</a><p>Каждый рабочий день с 09:00 до 18:00 МСК.</p></article><article><span>Адрес</span><strong>Санкт-Петербург, пр. Ветеранов, 166, лит. А</strong><p>Юридический и почтовый адрес компании.</p></article></div><form className="form-card" onSubmit={(e: FormEvent) => { e.preventDefault(); setSent(true); }}><h2>{sent ? "Сообщение отправлено" : "Написать команде"}</h2>{sent ? <div className="success-state"><span><Icon name="check" /></span><p>Спасибо! Мы ответим на указанный e‑mail в течение рабочего дня.</p><button className="button button-soft" type="button" onClick={() => setSent(false)}>Отправить ещё</button></div> : <><div className="form-two"><label>Имя<input required placeholder="Имя" /></label><label>Фамилия<input placeholder="Фамилия" /></label></div><label>E‑mail<input required type="email" placeholder="name@example.com" /></label><label>Номер телефона<input type="tel" placeholder="+7 (999) 000-00-00" /></label><label>Сообщение<textarea required rows={5} placeholder="Расскажите подробнее" /></label><label className="check-label"><input required type="checkbox" /> Я согласен на обработку персональных данных</label><button className="button button-primary" type="submit">Отправить сообщение <Icon name="arrow" /></button></>}</form></div></section><section className="section section-tint"><div className="container company-details"><div><span className="eyebrow">Реквизиты</span><h2>ООО «КТС-ИМПОРТ»</h2><p>Официальные данные владельца платформы Deels.</p></div><dl><div><dt>ИНН / КПП</dt><dd>7807396346 / 780701001</dd></div><div><dt>ОГРН</dt><dd>1147847408235</dd></div><div><dt>Расчётный счёт</dt><dd>40702810755240005617</dd></div><div><dt>Банк</dt><dd>СЕВЕРО-ЗАПАДНЫЙ БАНК ПАО СБЕРБАНК</dd></div><div><dt>БИК / корр. счёт</dt><dd>044030653 / 30101810500000000653</dd></div><div><dt>Генеральный директор</dt><dd>Серебряков Сергей Николаевич</dd></div></dl></div></section></main></PageShell>;
}

function OfferPage() {
  return <PageShell path="/offer"><main><CatalogHero eyebrow="Правила и прозрачность" title="Документы" text="Все условия использования Deels собраны в одном месте и написаны понятным языком." /><section className="section"><div className="container documents-grid"><aside className="docs-nav"><a href="#offer" className="active">Публичная оферта</a><a href="#privacy">Политика конфиденциальности</a><a href="#content">Правила контента</a><a href="#payments">Платежи и возвраты</a></aside><article className="content-card docs-content" id="offer"><span>Редакция от 6 августа 2026</span><h1>Публичная оферта</h1><p>Настоящий документ определяет порядок использования платформы Deels, участия в челленджах, публикации контента и работы с платёжными функциями.</p>{["1. Общие положения", "2. Регистрация и аккаунт", "3. Пользовательский контент", "4. Челленджи, призы и голосование", "5. Копилки и платежи", "6. Права и ответственность"].map((title, i) => <section key={title}><h2>{title}</h2><p>{i === 0 ? "Используя сайт или приложение, пользователь подтверждает согласие с условиями и обязуется соблюдать правила сообщества." : "Deels предоставляет техническую площадку и обеспечивает прозрачные правила взаимодействия. Подробные условия применяются с учётом выбранной функции и статуса пользователя."}</p></section>)}</article></div></section></main></PageShell>;
}

function AuthPage({ mode }: { mode: "login" | "register" }) {
  const register = mode === "register";
  return <PageShell path={`/${mode}`} minimal standalone><main className="auth-page theme-gradient"><div className="auth-visual theme-dark-card"><Brand /><span className="eyebrow"><Icon name="spark" /> Добро пожаловать в движение</span><h1>Создавай.<br />Участвуй.<br /><em>Вдохновляй.</em></h1><div className="auth-bubbles"><span>🕺</span><span>🎤</span><span>🏆</span></div></div><div className="auth-form-wrap"><form className="auth-card"><div className="mobile-auth-brand"><Brand /></div><span className="eyebrow">{register ? "Новый аккаунт" : "С возвращением"}</span><h2>{register ? "Регистрация в Deels" : "Войти в Deels"}</h2><p>{register ? "Присоединяйся к авторам и зрителям." : "Продолжай с того места, где остановился."}</p>{register && <label>Имя<input placeholder="Как тебя зовут" /></label>}<label>E‑mail или телефон<input placeholder={register ? "name@example.com" : "+7 999 000-00-00"} /></label><label>Пароль<div className="password-field"><input type="password" placeholder="Не менее 8 символов" /><button type="button">Показать</button></div></label>{!register && <div className="form-between"><label className="check-label"><input type="checkbox" /> Запомнить меня</label><A href="/forgot-password">Забыли пароль?</A></div>}<A href="/profile" className="button button-primary full">{register ? "Создать аккаунт" : "Войти"}</A><div className="or"><span>или</span></div><button className="button button-soft full" type="button">Продолжить с VK</button><p className="auth-switch">{register ? "Уже есть аккаунт?" : "Впервые в Deels?"} <A href={register ? "/login" : "/register"}>{register ? "Войти" : "Зарегистрироваться"}</A></p></form></div></main></PageShell>;
}

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  return <PageShell path="/forgot-password" minimal standalone><main className="auth-page theme-gradient"><div className="auth-visual theme-dark-card"><Brand /><span className="eyebrow"><Icon name="spark" /> Вернём доступ</span><h1>Твои идеи<br />никуда не<br /><em>пропали.</em></h1><div className="auth-bubbles"><span>✉</span><span>✓</span><span>🔒</span></div></div><div className="auth-form-wrap"><form className="auth-card" onSubmit={(e) => { e.preventDefault(); setSent(true); }}><div className="mobile-auth-brand"><Brand /></div><span className="eyebrow">Восстановление доступа</span><h2>{sent ? "Проверьте почту" : "Забыли пароль?"}</h2>{sent ? <div className="success-state recovery-success"><span><Icon name="check" /></span><p>Мы отправили ссылку для смены пароля. Она будет действовать 30 минут.</p><A href="/login" className="button button-primary full">Вернуться ко входу</A><button type="button" className="button button-soft full" onClick={() => setSent(false)}>Отправить повторно</button></div> : <><p>Укажите e‑mail, с которым регистрировались в Deels.</p><label>E‑mail<input required type="email" placeholder="name@example.com" /></label><button className="button button-primary full" type="submit">Отправить ссылку <Icon name="arrow" /></button><p className="auth-switch"><A href="/login"><Icon name="back" /> Вернуться ко входу</A></p></>}</form></div></main></PageShell>;
}

function DashboardShell({ path, title, subtitle, children }: { path: string; title: string; subtitle?: string; children: ReactNode }) {
  const items = [["user", "Профиль", "/profile"], ["wallet", "Кошелёк", "/wallet"], ["message", "Сообщения", "/messages"], ["bell", "Уведомления", "/notifications"], ["settings", "Настройки", "/settings"]];
  return <PageShell path={path} minimal><main className="dashboard-page"><div className="container dashboard-grid"><aside className="dashboard-sidebar"><div className="sidebar-user"><span className="avatar">СС</span><div><strong>Сергей</strong><span>@sergey.deels</span></div></div><nav>{items.map(([icon, label, href]) => <A className={path === href ? "active" : ""} href={href} key={href}><Icon name={icon} />{label}{label === "Сообщения" && <b>3</b>}</A>)}</nav><A href="/create" className="button button-primary"><Icon name="plus" /> Создать</A></aside><section className="dashboard-content"><div className="dashboard-title"><div><span className="eyebrow">Личный кабинет</span><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div></div>{children}</section></div></main></PageShell>;
}

function ProfilePage() {
  return <DashboardShell path="/profile" title="Мой профиль"><section className="profile-hero theme-dark-card"><div className="profile-main"><span className="avatar avatar-large">СС</span><div><h2>Сергей Серебряков <span>✓</span></h2><p>@sergey.deels • Санкт‑Петербург</p><p>Создаю идеи, которые хочется повторить.</p></div><button className="button button-white button-small">Редактировать</button></div><div className="profile-stats"><div><strong>12</strong><span>челленджей</span></div><div><strong>8,4K</strong><span>подписчиков</span></div><div><strong>126K</strong><span>голосов</span></div><div><strong>4</strong><span>победы</span></div></div></section><Filters items={["Мои видео", "Челленджи", "Сохранённое", "Копилки"]} /><div className="profile-video-grid">{challenges.map((item, i) => <A href={`/challenges/${item.id}`} key={item.id} className={`profile-video poster-${item.tone}`}><span>{item.emoji}</span><div><strong>{["84K", "62K", "41K", "28K", "21K", "18K"][i]}</strong><small>просмотров</small></div></A>)}</div></DashboardShell>;
}

function WalletPage() {
  return <DashboardShell path="/wallet" title="Кошелёк" subtitle="Баланс, призы и история операций"><section className="balance-grid"><article className="balance-card theme-dark-card"><span>Доступно</span><strong>18 450 ₽</strong><div><button className="button button-white button-small">Вывести</button><button className="button button-glass button-small">Пополнить</button></div></article><article className="balance-card"><span>Ожидает начисления</span><strong>5 000 ₽</strong><p>Приз за челлендж «Мой город»</p><small>до 9 августа</small></article></section><section className="content-card transactions"><div className="card-title"><h2>История операций</h2><select><option>За всё время</option><option>Этот месяц</option></select></div>{[["🏆", "Приз за челлендж", "+5 000 ₽", "Сегодня, 14:20"], ["↗", "Вывод на карту •• 4821", "−12 000 ₽", "4 августа"], ["💜", "Поддержка копилки", "−1 000 ₽", "2 августа"], ["✦", "Бонус Deels", "+450 ₽", "31 июля"]].map(row => <div className="transaction" key={row[1]}><span>{row[0]}</span><div><strong>{row[1]}</strong><small>{row[3]}</small></div><b className={row[2].startsWith("+") ? "positive" : ""}>{row[2]}</b></div>)}</section></DashboardShell>;
}

function MessagesPage() {
  const [active, setActive] = useState(0);
  const chats = [["АМ", "Алина Морозова", "Спасибо за поддержку!", "14:32"], ["DT", "Deels Team", "Ваш ролик вышел в топ", "12:18"], ["МК", "Миша К.", "Снимем совместный баттл?", "Вчера"]];
  return <DashboardShell path="/messages" title="Сообщения"><section className="messenger"><div className="chat-list"><div className="chat-search"><Icon name="search" /><input placeholder="Поиск диалогов" /></div>{chats.map((chat, i) => <button className={active === i ? "active" : ""} key={chat[1]} onClick={() => setActive(i)}><span className="avatar avatar-small">{chat[0]}</span><div><strong>{chat[1]}</strong><p>{chat[2]}</p></div><small>{chat[3]}</small></button>)}</div><div className="chat-window"><div className="chat-head"><span className="avatar avatar-small">{chats[active][0]}</span><div><strong>{chats[active][1]}</strong><span>в сети</span></div><Icon name="more" /></div><div className="chat-body"><span className="date-pill">Сегодня</span><p className="message incoming">Привет! Видел твой новый челлендж — очень крутая идея.</p><p className="message outgoing">Спасибо! Хочу собрать сильный финал 🔥</p><p className="message incoming">Давай снимем совместный ответ?</p></div><div className="message-input"><button><Icon name="plus" /></button><input placeholder="Написать сообщение" /><button className="send-button"><Icon name="arrow" /></button></div></div></section></DashboardShell>;
}

function NotificationsPage() {
  return <DashboardShell path="/notifications" title="Уведомления"><Filters items={["Все", "Активность", "Челленджи", "Система"]} /><section className="content-card notification-list">{[["🏆", "Вы вышли в финал!", "Ваш ответ в челлендже «Мой город» попал в топ‑10.", "5 мин"], ["♡", "Новые голоса", "Ваш ролик получил 246 новых голосов за последний час.", "1 ч"], ["АМ", "Алина подписалась на вас", "Теперь она увидит ваши новые публикации.", "3 ч"], ["✦", "Челлендж недели", "Новый бренд‑челлендж с фондом 100 000 ₽ уже стартовал.", "Вчера"]].map((n, i) => <article className={i < 2 ? "unread" : ""} key={n[1]}><span className="notice-icon">{n[0]}</span><div><strong>{n[1]}</strong><p>{n[2]}</p></div><small>{n[3]}</small></article>)}</section></DashboardShell>;
}

function SearchPage() {
  const [query, setQuery] = useState("танцы");
  return <PageShell path="/search"><main><section className="search-page"><div className="container"><span className="eyebrow"><Icon name="search" /> Поиск по Deels</span><div className="big-search"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Челлендж, автор или история" /><button><Icon name="search" /> Найти</button></div><Filters items={["Всё", "Челленджи", "Авторы", "Видео", "Истории"]} /><div className="search-summary"><h2>Результаты по запросу «{query || "…"}»</h2><span>48 результатов</span></div><div className="search-layout"><div className="catalog-grid compact-grid">{challenges.slice(0, 4).map(item => <ChallengeCard key={item.id} item={item} compact />)}</div><aside className="content-card people-results"><h3>Авторы</h3>{[["АМ", "Алина Moves", "24,8K"], ["DC", "Dance Club", "18,2K"], ["МС", "Мила Sun", "12,4K"]].map(p => <A href="/profile" key={p[1]}><span className="avatar avatar-small">{p[0]}</span><div><strong>{p[1]}</strong><small>{p[2]} подписчиков</small></div><span className="follow-button">+</span></A>)}</aside></div></div></section></main></PageShell>;
}

function SettingsPage() {
  const [saved, setSaved] = useState(false);
  return <DashboardShell path="/settings" title="Настройки"><div className="settings-layout"><nav><a href="#account" className="active">Аккаунт</a><a href="#privacy">Приватность</a><a href="#notifications">Уведомления</a><a href="#security">Безопасность</a></nav><form className="content-card settings-form" onSubmit={e => { e.preventDefault(); setSaved(true); }}><div className="settings-avatar"><span className="avatar avatar-large">СС</span><button type="button" className="button button-soft button-small">Изменить фото</button></div><div className="form-two"><label>Имя<input defaultValue="Сергей" /></label><label>Фамилия<input defaultValue="Серебряков" /></label></div><label>Имя пользователя<div className="prefix-input"><span>@</span><input defaultValue="sergey.deels" /></div></label><label>О себе<textarea rows={4} defaultValue="Создаю идеи, которые хочется повторить." /></label><label>Город<input defaultValue="Санкт-Петербург" /></label><button className="button button-primary" type="submit">{saved ? "Сохранено ✓" : "Сохранить изменения"}</button></form></div></DashboardShell>;
}

function CreateHub() {
  return <PageShell path="/create"><main><CatalogHero eyebrow="Начни с идеи" title="Что создаём?" text="Выбери формат — дальше Deels проведёт по понятным шагам и сразу покажет результат." /><section className="section"><div className="container create-choice-grid"><A href="/create/challenge" className="create-choice theme-dark-card"><span>🏆</span><small>Самый популярный формат</small><h2>Челлендж</h2><p>Задание, ответы участников, голосование и призовой фонд.</p><b>Создать челлендж <Icon name="arrow" /></b></A><A href="/create/story" className="create-choice poster-pink"><span>✨</span><small>Расскажи важное</small><h2>История</h2><p>Вертикальное видео с текстом, темой и обсуждением.</p><b>Создать историю <Icon name="arrow" /></b></A><A href="/create/campaign" className="create-choice poster-blue"><span>💜</span><small>Собери поддержку</small><h2>Копилка</h2><p>Цель, документы, новости и прозрачный прогресс сбора.</p><b>Создать копилку <Icon name="arrow" /></b></A></div></section></main></PageShell>;
}

function CreatePage({ type, editing = false }: { type: "challenge" | "story" | "campaign"; editing?: boolean }) {
  const labels = type === "challenge" ? { eyebrow: "Новый челлендж", title: "Повтори мой летний движ", desc: "Покажи свой фирменный танец за 30 секунд.", emoji: "🕺", button: "Опубликовать челлендж" } : type === "story" ? { eyebrow: "Новая история", title: "Мой поворотный момент", desc: "Расскажи, что изменило твою жизнь.", emoji: "✨", button: "Опубликовать историю" } : { eyebrow: "Новая копилка", title: "Важная цель", desc: "Объясни, кому и зачем нужна поддержка.", emoji: "💜", button: "Отправить на проверку" };
  const [title, setTitle] = useState(labels.title); const [step, setStep] = useState(1); const [done, setDone] = useState(false);
  return <PageShell path={`/create/${type}`} minimal standalone><main className="create-page"><div className="container create-head"><A href="/create" className="back-link"><Icon name="back" /> Назад к форматам</A><Brand /><button className="button button-soft button-small">Сохранить черновик</button></div>{done ? <div className="publish-success"><span><Icon name="check" /></span><h1>{type === "campaign" ? "Заявка отправлена" : "Готово! Публикация создана"}</h1><p>{type === "campaign" ? "Мы проверим документы и сообщим о результате." : "Уже можно делиться ссылкой и приглашать участников."}</p><A href={type === "campaign" ? "/campaigns/help-masha" : "/challenges/summer-move"} className="button button-primary">Посмотреть страницу <Icon name="arrow" /></A></div> : <div className="container create-layout"><section className="create-form"><span className="eyebrow">{editing ? "Редактирование" : labels.eyebrow}</span><h1>{editing ? "Обновить челлендж" : "Расскажи об идее"}</h1><div className="stepper">{[1, 2, 3].map(n => <button key={n} className={step >= n ? "active" : ""} onClick={() => setStep(n)}><span>{step > n ? "✓" : n}</span>{["Основное", "Медиа и условия", "Проверка"][n - 1]}</button>)}</div>{step === 1 && <div className="form-stack"><label>Название<input value={title} maxLength={60} onChange={e => setTitle(e.target.value)} /><small>{title.length}/60</small></label><label>Короткое описание<textarea rows={4} defaultValue={labels.desc} /></label><label>Категория<select><option>{type === "challenge" ? "Танцы" : type === "story" ? "Вдохновение" : "Социальная помощь"}</option><option>Творчество</option><option>Спорт</option></select></label>{type === "campaign" && <label>Цель сбора<div className="suffix-input"><input defaultValue="2 000 000" /><span>₽</span></div></label>}</div>}{step === 2 && <div className="form-stack"><label className="upload-zone"><span>{labels.emoji}</span><strong>Загрузить обложку или видео</strong><p>MP4, MOV, JPG или PNG • до 200 МБ</p><button type="button" className="button button-soft button-small">Выбрать файл</button></label>{type === "challenge" && <><div className="form-two"><label>Призовой фонд<div className="suffix-input"><input defaultValue="50 000" /><span>₽</span></div></label><label>Дата завершения<input type="date" defaultValue="2026-08-20" /></label></div><label>Правила<textarea rows={4} defaultValue="Одно вертикальное видео до 30 секунд. Используйте оригинальный звук челленджа." /></label></>}{type === "campaign" && <label className="upload-zone small"><strong>Документы для проверки</strong><p>Выписки, счета и подтверждающие документы</p><button type="button" className="button button-soft button-small">Добавить документы</button></label>}</div>}{step === 3 && <div className="review-card"><span><Icon name="check" /></span><h3>Всё готово к публикации</h3><p>Проверь данные в превью. После публикации основные условия можно будет изменить только до первого участника.</p><label className="check-label"><input type="checkbox" defaultChecked /> Я принимаю правила публикации контента</label></div>}<div className="form-actions"><button className="button button-soft" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>Назад</button>{step < 3 ? <button className="button button-primary" onClick={() => setStep(step + 1)}>Продолжить <Icon name="arrow" /></button> : <button className="button button-primary" onClick={() => setDone(true)}>{editing ? "Сохранить изменения" : labels.button}</button>}</div></section><aside className="create-preview"><span>Превью</span><div className={`preview-phone poster-${type === "challenge" ? "violet" : type === "story" ? "pink" : "blue"}`}><div className="phone-top"><Brand /><Icon name="bell" /></div><span className="poster-emoji">{labels.emoji}</span><div className="poster-caption"><span>@sergey.deels</span><strong>{title || "Название публикации"}</strong><small>{labels.desc}</small></div></div><p>Так карточка будет выглядеть в ленте</p></aside></div>}</main></PageShell>;
}

function ScreensPage() {
  return <PageShell path="/screens"><main><CatalogHero eyebrow="Дизайн‑система Deels" title="Все экраны" text="Кликабельная карта полного веб‑контура: публичная часть, личный кабинет и создание контента." /><section className="section"><div className="container screens-summary"><div><strong>26</strong><span>основных экранов</span></div><div><strong>2</strong><span>адаптивных режима</span></div><div><strong>1</strong><span>единая тема</span></div></div><div className="container screens-groups">{screenGroups.map(group => <section key={group.title}><h2>{group.title}</h2><div>{group.items.map(([label, href], i) => <A href={href} key={href}><span>{String(i + 1).padStart(2, "0")}</span><strong>{label}</strong><small>{href}</small><Icon name="arrow" /></A>)}</div></section>)}</div></section></main></PageShell>;
}

function NotFound() {
  return <PageShell path="/"><main className="empty-page theme-gradient"><span>404</span><h1>Такой страницы пока нет</h1><p>Зато в Deels уже есть тысячи идей, которые можно повторить.</p><A href="/" className="button button-primary">На главную</A></main></PageShell>;
}

export function DeelsApp({ initialPath }: { initialPath: string }) {
  const path = useMemo(() => initialPath.replace(/\/$/, "") || "/", [initialPath]);
  if (path === "/") return <HomePage />;
  if (path === "/challenges") return <ChallengesPage />;
  if (path.startsWith("/challenges/")) return <ChallengeDetail />;
  if (path === "/feed") return <FeedPage />;
  if (path === "/battles") return <BattlesPage />;
  if (path === "/stories") return <StoriesPage />;
  if (path.startsWith("/stories/")) return <StoryDetail />;
  if (path === "/campaigns") return <CampaignsPage />;
  if (path.startsWith("/campaigns/")) return <CampaignDetail />;
  if (path === "/about-us") return <AboutPage />;
  if (path === "/contact-us") return <ContactPage />;
  if (path === "/offer") return <OfferPage />;
  if (path === "/login" || path === "/register") return <AuthPage mode={path.slice(1) as "login" | "register"} />;
  if (path === "/forgot-password") return <ForgotPasswordPage />;
  if (path === "/profile") return <ProfilePage />;
  if (path === "/wallet") return <WalletPage />;
  if (path === "/messages") return <MessagesPage />;
  if (path === "/notifications") return <NotificationsPage />;
  if (path === "/search") return <SearchPage />;
  if (path === "/settings") return <SettingsPage />;
  if (path === "/create") return <CreateHub />;
  if (path === "/create/challenge") return <CreatePage type="challenge" />;
  if (path === "/create/story") return <CreatePage type="story" />;
  if (path === "/create/campaign") return <CreatePage type="campaign" />;
  if (path === "/edit/challenge") return <CreatePage type="challenge" editing />;
  if (path === "/screens") return <ScreensPage />;
  return <NotFound />;
}
