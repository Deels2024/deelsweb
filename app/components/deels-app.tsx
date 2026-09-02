"use client";

import {
  Fragment,
  type AnchorHTMLAttributes,
  type FormEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ApiError,
  apiConfig,
  apiErrorText,
  deelsApi,
  useApiResource,
  type BattleView,
  type CampaignView,
  type ChallengeView,
  type ContentDraft,
  type DialogView,
  type MessageView,
  type NotificationView,
  type SearchResultView,
  type StatsView,
  type StoryView,
  type UserView,
  type WalletView,
} from "../lib/api";
import { getLegalDocument, legalDocuments } from "../lib/legal";

const challenges: ChallengeView[] = [
  {
    id: "summer-move",
    title: "Повтори летний движ",
    author: "deels.team",
    prize: "50 000 ₽",
    participants: "1,2K",
    tag: "Танцы",
    emoji: "🕺",
    tone: "violet",
  },
  {
    id: "kindness-chain",
    title: "Цепочка добрых дел",
    author: "mila.sun",
    prize: "25 000 ₽",
    participants: "846",
    tag: "Добро",
    emoji: "🤍",
    tone: "coral",
  },
  {
    id: "city-frame",
    title: "Мой город за 15 секунд",
    author: "urban.day",
    prize: "30 000 ₽",
    participants: "734",
    tag: "Творчество",
    emoji: "🏙️",
    tone: "blue",
  },
  {
    id: "voice-up",
    title: "Твой голос — твоя сила",
    author: "voiceclub",
    prize: "15 000 ₽",
    participants: "590",
    tag: "Музыка",
    emoji: "🎤",
    tone: "pink",
  },
  {
    id: "family-recipe",
    title: "Семейный рецепт",
    author: "food.room",
    prize: "20 000 ₽",
    participants: "428",
    tag: "Еда",
    emoji: "🥣",
    tone: "lime",
  },
  {
    id: "pet-star",
    title: "Звезда моего дома",
    author: "pets.deels",
    prize: "10 000 ₽",
    participants: "1,8K",
    tag: "Питомцы",
    emoji: "🐕",
    tone: "orange",
  },
];

const stories: StoryView[] = [
  {
    id: "dance-with-me",
    title: "Танец, который вернул уверенность",
    author: "Алина М.",
    time: "2 мин",
    emoji: "✨",
    tone: "pink",
  },
  {
    id: "first-stage",
    title: "Как я впервые вышел на сцену",
    author: "Илья С.",
    time: "4 мин",
    emoji: "🎭",
    tone: "blue",
  },
  {
    id: "new-city",
    title: "Новый город и 100 новых друзей",
    author: "Саша К.",
    time: "3 мин",
    emoji: "🛹",
    tone: "orange",
  },
  {
    id: "little-win",
    title: "Моя маленькая большая победа",
    author: "Вика Д.",
    time: "2 мин",
    emoji: "🏆",
    tone: "violet",
  },
];

const campaigns: CampaignView[] = [
  {
    id: "help-masha",
    title: "Поможем Маше снова танцевать",
    raised: 78,
    sum: "1 564 300 ₽",
    goal: "2 000 000 ₽",
    emoji: "💜",
    tone: "violet",
  },
  {
    id: "creative-yard",
    title: "Творческий двор для подростков",
    raised: 64,
    sum: "641 200 ₽",
    goal: "1 000 000 ₽",
    emoji: "🎨",
    tone: "coral",
  },
  {
    id: "animal-home",
    title: "Тёплый дом для 40 хвостов",
    raised: 91,
    sum: "819 000 ₽",
    goal: "900 000 ₽",
    emoji: "🐾",
    tone: "blue",
  },
];
const demoContent = { challenges, stories, campaigns };
const demoUser: UserView = {
  id: "me",
  name: "Сергей Серебряков",
  username: "sergey.deels",
  city: "Санкт-Петербург",
  bio: "Создаю идеи, которые хочется повторить.",
  initials: "СС",
  posts: "6",
  votes: "126K",
  wins: "4",
};
const demoStats: StatsView = {
  creators: "12,4K",
  responses: "180K",
  votes: "8,7M",
  campaigns: "4,6M ₽",
};
const demoWallet: WalletView = {
  available: "18 450 ₽",
  pending: "5 000 ₽",
  transactions: [
    {
      id: "prize",
      title: "Приз за челлендж",
      amount: "+5 000 ₽",
      occurredAt: "Сегодня, 14:20",
      direction: "credit",
    },
    {
      id: "withdraw",
      title: "Вывод на карту •• 4821",
      amount: "−12 000 ₽",
      occurredAt: "4 августа",
      direction: "debit",
    },
    {
      id: "campaign",
      title: "Поддержка копилки",
      amount: "−1 000 ₽",
      occurredAt: "2 августа",
      direction: "debit",
    },
    {
      id: "bonus",
      title: "Бонус Deels",
      amount: "+450 ₽",
      occurredAt: "31 июля",
      direction: "credit",
    },
  ],
};
const demoDialogs: DialogView[] = [
  {
    id: "alina",
    title: "Алина Морозова",
    avatar: "АМ",
    preview: "Спасибо за поддержку!",
    time: "14:32",
    unread: 1,
  },
  {
    id: "team",
    title: "Deels Team",
    avatar: "DT",
    preview: "Ваш ролик вышел в топ",
    time: "12:18",
    unread: 2,
  },
  {
    id: "misha",
    title: "Миша К.",
    avatar: "МК",
    preview: "Снимем совместный баттл?",
    time: "Вчера",
    unread: 0,
  },
];
const demoMessages: MessageView[] = [
  {
    id: "m1",
    text: "Привет! Видел твой новый челлендж — очень крутая идея.",
    time: "14:28",
    direction: "incoming",
  },
  {
    id: "m2",
    text: "Спасибо! Хочу собрать сильный финал 🔥",
    time: "14:30",
    direction: "outgoing",
    status: "read",
  },
  {
    id: "m3",
    text: "Давай снимем совместный ответ?",
    time: "14:32",
    direction: "incoming",
  },
];
const demoBattles: BattleView[] = challenges.slice(0, 3).map((item, index) => ({
  id: `battle-${item.id}`,
  title: item.title,
  round: `Раунд ${index + 1} из 5`,
  endsIn: `${12 + index * 4} ч.`,
  totalVotes: 1824 + index * 320,
  status: "active",
  sides: [
    {
      id: `${item.id}-left`,
      author: item.author,
      emoji: item.emoji,
      tone: item.tone,
      percent: 52 + index * 3,
      votes: 950 + index * 100,
    },
    {
      id: `${item.id}-right`,
      author: challenges[index + 1].author,
      emoji: challenges[index + 1].emoji,
      tone: challenges[index + 1].tone,
      percent: 48 - index * 3,
      votes: 874 + index * 220,
    },
  ],
}));
const demoNotifications: NotificationView[] = [
  {
    id: "final",
    icon: "🏆",
    title: "Вы вышли в финал!",
    text: "Ваш ответ в челлендже «Мой город» попал в топ‑10.",
    time: "5 мин",
    unread: true,
    category: "challenge",
  },
  {
    id: "votes",
    icon: "♡",
    title: "Новые голоса",
    text: "Ваш ролик получил 246 новых голосов за последний час.",
    time: "1 ч",
    unread: true,
    category: "activity",
  },
  {
    id: "follow",
    icon: "АМ",
    title: "Алина подписалась на вас",
    text: "Теперь она увидит ваши новые публикации.",
    time: "3 ч",
    unread: false,
    category: "activity",
  },
  {
    id: "week",
    icon: "✦",
    title: "Челлендж недели",
    text: "Новый бренд‑челлендж с фондом 100 000 ₽ уже стартовал.",
    time: "Вчера",
    unread: false,
    category: "system",
  },
];

const screenGroups = [
  {
    title: "Публичные страницы",
    items: [
      ["Главная", "/"],
      ["Челленджи", "/challenges"],
      ["Карточка челленджа", "/challenges/summer-move"],
      ["Лента", "/feed"],
      ["Баттлы", "/battles"],
      ["Истории", "/stories"],
      ["Карточка истории", "/stories/dance-with-me"],
      ["Копилки", "/campaigns"],
      ["Карточка копилки", "/campaigns/help-masha"],
      ["О проекте", "/about-us"],
      ["Контакты", "/contact-us"],
      ["Документы", "/offer"],
    ],
  },
  {
    title: "Вход и профиль",
    items: [
      ["Войти", "/login"],
      ["Регистрация", "/register"],
      ["Восстановление пароля", "/forgot-password"],
      ["Подтверждение почты", "/verify-email/demo"],
      ["Профиль", "/profile"],
      ["Кошелёк", "/wallet"],
      ["Сообщения", "/messages"],
      ["Уведомления", "/notifications"],
      ["Поиск", "/search"],
      ["Настройки", "/settings"],
    ],
  },
  {
    title: "Создание",
    items: [
      ["Выбор формата", "/create"],
      ["Новый челлендж", "/create/challenge"],
      ["Новая история", "/create/story"],
      ["Новая копилка", "/create/campaign"],
      ["Ответ на челлендж", "/challenges/summer-move/respond"],
      ["Редактирование", "/edit/challenge/summer-move"],
    ],
  },
];

function Icon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    home: "⌂",
    search: "⌕",
    plus: "+",
    bell: "◌",
    user: "●",
    play: "▶",
    arrow: "→",
    heart: "♡",
    comment: "◯",
    share: "↗",
    wallet: "₽",
    menu: "≡",
    close: "×",
    check: "✓",
    more: "•••",
    back: "←",
    fire: "↗",
    spark: "✦",
    message: "✉",
    settings: "⚙",
  };
  return (
    <span className={`icon icon-${name}`} aria-hidden="true">
      {icons[name] ?? "•"}
    </span>
  );
}

function A({
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a href={href} {...props} />;
}

function Brand() {
  return (
    <A href="/" className="brand" aria-label="Deels — главная">
      <span className="brand-mark">D</span>
      <span className="brand-word">DEELS</span>
    </A>
  );
}

function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <button
          type="button"
          className="icon-button mobile-menu-button"
          onClick={onMenu}
          aria-label="Открыть меню"
        >
          <Icon name="menu" />
        </button>
        <Brand />
        <nav className="desktop-nav" aria-label="Основная навигация">
          <A href="/feed">Лента</A>
          <A href="/challenges">Челленджи</A>
          <A href="/battles">Баттлы</A>
          <A href="/stories">Истории</A>
          <A href="/campaigns">Копилки</A>
        </nav>
        <div className="header-actions">
          <A href="/search" className="icon-button">
            <Icon name="search" />
          </A>
          <A href="/notifications" className="icon-button desktop-only">
            <Icon name="bell" />
            <span className="notification-dot" />
          </A>
          <A href="/create" className="button button-primary button-small">
            <Icon name="plus" /> Создать
          </A>
          <A href="/profile" className="avatar avatar-small desktop-only">
            СС
          </A>
        </div>
      </div>
    </header>
  );
}

function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <button
        type="button"
        className={`drawer-scrim ${open ? "is-open" : ""}`}
        onClick={onClose}
        aria-label="Закрыть меню"
        tabIndex={open ? 0 : -1}
      />
      <aside
        aria-hidden={!open}
        className={`mobile-drawer ${open ? "is-open" : ""}`}
      >
        <div className="drawer-head">
          <Brand />
          <button
            type="button"
            aria-label="Закрыть меню"
            className="icon-button"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Мобильная навигация">
          {[
            ["Лента", "/feed"],
            ["Челленджи", "/challenges"],
            ["Баттлы", "/battles"],
            ["Истории", "/stories"],
            ["Копилки", "/campaigns"],
            ["Профиль", "/profile"],
            ["Все экраны", "/screens"],
          ].map(([label, href]) => (
            <A key={href} href={href}>
              {label}
              <Icon name="arrow" />
            </A>
          ))}
        </nav>
        <A href="/create" className="button button-primary">
          Создать в Deels
        </A>
      </aside>
    </>
  );
}

function MobileNav({ path }: { path: string }) {
  const items = [
    ["home", "Главная", "/"],
    ["search", "Поиск", "/search"],
    ["plus", "Создать", "/create"],
    ["bell", "События", "/notifications"],
    ["user", "Профиль", "/profile"],
  ];
  return (
    <nav className="mobile-bottom-nav">
      {items.map(([icon, label, href]) => (
        <A
          key={href}
          href={href}
          className={`${path === href ? "active" : ""} ${href === "/create" ? "create-nav" : ""}`}
        >
          <Icon name={icon} />
          <span>{label}</span>
        </A>
      ))}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Brand />
          <p>
            Новая развлекательная соцсеть, где идеи превращаются в движение.
          </p>
          <div className="socials">
            <span>VK</span>
            <span>TG</span>
            <span>YT</span>
          </div>
        </div>
        <div>
          <h4>Смотреть</h4>
          <A href="/feed">Лента</A>
          <A href="/challenges">Челленджи</A>
          <A href="/stories">Истории</A>
          <A href="/campaigns">Копилки</A>
        </div>
        <div>
          <h4>Deels</h4>
          <A href="/about-us">О проекте</A>
          <A href="/contact-us">Контакты</A>
          <A href="/offer">Документы</A>
          <A href="/screens">Карта экранов</A>
        </div>
        <div>
          <h4>Будь в движении</h4>
          <p>Скачивай приложение и участвуй первым.</p>
          <div className="store-buttons">
            <A
              href="https://apps.apple.com/app/id6480409656"
              target="_blank"
              rel="noreferrer"
            >
              App Store
            </A>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Deels</span>
        <span>Сделано для настоящих идей</span>
      </div>
    </footer>
  );
}

function CookieConsent() {
  const [choice, setChoice] = useState<"necessary" | "all" | null>(null);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem("deels-cookie-consent");
      if (saved === "necessary" || saved === "all") setChoice(saved);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  if (choice) return null;
  function save(next: "necessary" | "all") {
    window.localStorage.setItem("deels-cookie-consent", next);
    window.dispatchEvent(new CustomEvent("deels:consent", { detail: next }));
    setChoice(next);
  }
  return (
    <aside className="cookie-consent" aria-label="Настройки cookie">
      <div>
        <strong>Cookie — только под вашим контролем</strong>
        <p>
          Обязательные cookie нужны для входа и безопасности. Аналитика
          включится только после согласия.{" "}
          <A href="/documents/cookies">Подробнее</A>
        </p>
      </div>
      <div>
        <button
          type="button"
          className="button button-soft button-small"
          onClick={() => save("necessary")}
        >
          Только необходимые
        </button>
        <button
          type="button"
          className="button button-primary button-small"
          onClick={() => save("all")}
        >
          Разрешить аналитику
        </button>
      </div>
    </aside>
  );
}

function PageShell({
  path,
  children,
  minimal = false,
  standalone = false,
}: {
  path: string;
  children: ReactNode;
  minimal?: boolean;
  standalone?: boolean;
}) {
  const [drawer, setDrawer] = useState(false);
  return (
    <div
      className="deels-app light_theme light_there"
      data-api-mode={apiConfig.mode}
    >
      <a className="skip-link" href="#main-content">
        Перейти к содержанию
      </a>
      {!standalone && (
        <>
          <Header onMenu={() => setDrawer(true)} />
          <MobileDrawer open={drawer} onClose={() => setDrawer(false)} />
        </>
      )}
      <div id="main-content">{children}</div>
      {!minimal && !standalone && <Footer />}
      {!standalone && (
        <>
          <MobileNav path={path} />
          <CookieConsent />
        </>
      )}
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  text,
  link,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  link?: string;
}) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && (
          <span className="eyebrow">
            <Icon name="spark" /> {eyebrow}
          </span>
        )}
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {link && (
        <A href={link} className="text-link">
          Смотреть все <Icon name="arrow" />
        </A>
      )}
    </div>
  );
}

function ChallengeCard({
  item,
  compact = false,
}: {
  item: ChallengeView;
  compact?: boolean;
}) {
  const [saved, setSaved] = useState(Boolean(item.saved));
  const [saving, setSaving] = useState(false);
  async function toggleSaved(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (saving) return;
    setSaving(true);
    try {
      if (apiConfig.mode !== "demo") await deelsApi.challenges.save(item.id);
      setSaved((value) => !value);
    } finally {
      setSaving(false);
    }
  }
  return (
    <article className={`video-card ${compact ? "compact" : ""}`}>
      <div className={`poster poster-${item.tone}`}>
        <A
          href={`/challenges/${item.id}`}
          className="poster-link"
          aria-label={`Открыть челлендж «${item.title}»`}
        />
        <div className="poster-top">
          <span className="poster-tag">{item.tag}</span>
          <button
            type="button"
            className={`round-action ${saved ? "active" : ""}`}
            disabled={saving}
            aria-label={saved ? "Убрать из сохранённого" : "Сохранить челлендж"}
            aria-pressed={saved}
            onClick={toggleSaved}
          >
            <Icon name="heart" />
          </button>
        </div>
        <span className="poster-emoji">{item.emoji}</span>
        <div className="poster-caption">
          <span>@{item.author}</span>
          <strong>{item.title}</strong>
        </div>
        <span className="play-button">
          <Icon name="play" />
        </span>
      </div>
      <div className="card-meta">
        <div>
          <strong>{item.prize}</strong>
          <span>призовой фонд</span>
        </div>
        <div>
          <strong>{item.participants}</strong>
          <span>участников</span>
        </div>
      </div>
    </article>
  );
}

function StoryCard({ item }: { item: StoryView }) {
  return (
    <A
      href={`/stories/${item.id}`}
      className={`story-card poster-${item.tone}`}
    >
      <div className="story-icon">{item.emoji}</div>
      <div>
        <span>
          {item.time} • @{item.author}
        </span>
        <h3>{item.title}</h3>
        <span className="story-more">
          Смотреть историю <Icon name="arrow" />
        </span>
      </div>
    </A>
  );
}

function CampaignCard({ item }: { item: CampaignView }) {
  return (
    <article className="campaign-card">
      <A
        href={`/campaigns/${item.id}`}
        className={`campaign-cover poster-${item.tone}`}
      >
        <span>{item.emoji}</span>
        <span className="poster-tag">Проверенная копилка</span>
      </A>
      <div className="campaign-body">
        <h3>{item.title}</h3>
        <div className="progress-line">
          <span style={{ width: `${item.raised}%` }} />
        </div>
        <div className="progress-meta">
          <strong>{item.sum}</strong>
          <span>из {item.goal}</span>
        </div>
        <A href={`/campaigns/${item.id}`} className="button button-soft">
          Поддержать
        </A>
      </div>
    </article>
  );
}

function HomePage() {
  const { data: stats } = useApiResource(
    "home-stats",
    () => deelsApi.stats.summary(),
    demoStats,
  );
  const { data: challenges } = useApiResource(
    "home-challenges",
    async () =>
      (await deelsApi.challenges.list({ limit: 4, sort: "popular" })).items,
    demoContent.challenges,
  );
  const { data: stories } = useApiResource(
    "home-stories",
    async () => (await deelsApi.stories.list({ limit: 3 })).items,
    demoContent.stories,
  );
  const { data: campaigns } = useApiResource(
    "home-campaigns",
    async () =>
      (await deelsApi.campaigns.list({ limit: 3, verified: true })).items,
    demoContent.campaigns,
  );
  return (
    <PageShell path="/">
      <main>
        <section className="hero theme-gradient">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">
                <Icon name="spark" /> Здесь начинается движение
              </span>
              <h1>
                Твоя идея
                <br />
                может стать <em>движением</em>
              </h1>
              <p>
                Создавай челленджи, снимай ответы, участвуй в баттлах и
                поддерживай истории, которые хочется разделить.
              </p>
              <div className="hero-actions">
                <A href="/create/challenge" className="button button-primary">
                  Создать челлендж <Icon name="arrow" />
                </A>
                <A href="/feed" className="button button-glass">
                  <Icon name="play" /> Смотреть ленту
                </A>
              </div>
              <div className="hero-proof">
                <div className="avatar-stack">
                  <span>АК</span>
                  <span>МС</span>
                  <span>ОЛ</span>
                  <span>+{stats.creators}</span>
                </div>
                <p>
                  <strong>{stats.creators}+</strong>
                  <br />
                  уже создают в Deels
                </p>
              </div>
            </div>
            <div className="hero-visual">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="floating-chip chip-prize">
                <span>🏆</span>
                <strong>50 000 ₽</strong>
                <small>призовой фонд</small>
              </div>
              <div className="floating-chip chip-trend">
                <span>↗</span>
                <strong>В тренде</strong>
                <small>{stats.responses} ответов</small>
              </div>
              <div className="phone-frame">
                <div className="phone-top">
                  <Brand />
                  <Icon name="bell" />
                </div>
                <div className="phone-video poster-violet">
                  <span className="phone-live">DEELS • LIVE</span>
                  <span className="poster-emoji">🕺</span>
                  <div className="phone-side">
                    <span>
                      <Icon name="heart" />
                      <small>8,2K</small>
                    </span>
                    <span>
                      <Icon name="comment" />
                      <small>462</small>
                    </span>
                    <span>
                      <Icon name="share" />
                      <small>92</small>
                    </span>
                  </div>
                  <div className="phone-caption">
                    <small>@mila.sun</small>
                    <strong>Повтори летний движ</strong>
                    <span>#танцы #deels</span>
                  </div>
                </div>
                <div className="phone-nav">
                  <span>⌂</span>
                  <span>⌕</span>
                  <b>+</b>
                  <span>◌</span>
                  <span>●</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <SectionHead
              eyebrow="Горячее сейчас"
              title="Челленджи, о которых говорят"
              text="Выбирай идею, снимай свой ответ и забирай внимание аудитории."
              link="/challenges"
            />
            <div className="horizontal-cards">
              {challenges.slice(0, 4).map((item) => (
                <ChallengeCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
        <section className="section section-dark theme-dark-card">
          <div className="container">
            <SectionHead
              eyebrow="Простая механика"
              title="От идеи до победы — три шага"
              text="Никаких сложных правил. Только ты, камера и желание попробовать."
            />
            <div className="steps-grid">
              <article>
                <span>01</span>
                <div className="step-icon">✦</div>
                <h3>Найди свой вызов</h3>
                <p>Выбери челлендж, который тебя цепляет.</p>
              </article>
              <article>
                <span>02</span>
                <div className="step-icon">▶</div>
                <h3>Сними ответ</h3>
                <p>Покажи свой вариант в коротком вертикальном видео.</p>
              </article>
              <article>
                <span>03</span>
                <div className="step-icon">🏆</div>
                <h3>Собери голоса</h3>
                <p>Делись, получай поддержку и выходи в топ.</p>
              </article>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container split-feature">
            <div>
              <SectionHead
                eyebrow="Истории Deels"
                title="Не просто видео. Настоящие истории"
                text="Люди рассказывают о шагах, которые изменили их жизнь. Иногда достаточно одного честного ролика, чтобы вдохновить тысячи."
              />
              <A href="/stories" className="button button-dark">
                Смотреть истории <Icon name="arrow" />
              </A>
            </div>
            <div className="stories-stack">
              {stories.slice(0, 3).map((item) => (
                <StoryCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
        <section className="section section-tint">
          <div className="container">
            <SectionHead
              eyebrow="Делись добром"
              title="Копилки, которые меняют жизнь"
              text="Поддерживай проверенные сборы и следи за результатом вместе с сообществом."
              link="/campaigns"
            />
            <div className="campaign-grid">
              {campaigns.map((item) => (
                <CampaignCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container cta-card theme-dark-card">
            <div>
              <span className="eyebrow">
                <Icon name="spark" /> Твой ход
              </span>
              <h2>
                Готов создать то,
                <br />
                что подхватят другие?
              </h2>
              <p>Начни с первого челленджа. Это займёт меньше пяти минут.</p>
            </div>
            <A href="/create" className="button button-white">
              Создать в Deels <Icon name="arrow" />
            </A>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function CatalogHero({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <section className="catalog-hero theme-gradient">
      <div className="container">
        <span className="eyebrow">
          <Icon name="spark" /> {eyebrow}
        </span>
        <h1>{title}</h1>
        <p>{text}</p>
        {children}
      </div>
    </section>
  );
}

function Filters({
  items,
  value,
  onChange,
  label = "Фильтры",
}: {
  items: string[];
  value?: string;
  onChange?: (item: string) => void;
  label?: string;
}) {
  const [localValue, setLocalValue] = useState(items[0]);
  const active = value ?? localValue;
  return (
    <div className="filter-row" role="tablist" aria-label={label}>
      {items.map((item) => (
        <button
          type="button"
          role="tab"
          aria-selected={active === item}
          key={item}
          className={active === item ? "active" : ""}
          onClick={() => {
            setLocalValue(item);
            onChange?.(item);
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function StatusLine({
  loading,
  error,
  source,
  onRetry,
}: {
  loading?: boolean;
  error?: string;
  source?: "api" | "demo";
  onRetry?: () => void;
}) {
  if (loading)
    return (
      <p className="status-line" role="status">
        Загружаем актуальные данные…
      </p>
    );
  if (error)
    return (
      <div className="status-line warning" role="alert">
        <span>{source === "demo" ? "Показаны демонстрационные данные. " : ""}{error}</span>
        <button type="button" onClick={onRetry ?? (() => window.location.reload())}>Повторить</button>
      </div>
    );
  return null;
}

function formatCount(value = 0): string {
  return new Intl.NumberFormat("ru-RU", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function useAuthGuard(): { checking: boolean; error?: string } {
  const [state, setState] = useState<{ checking: boolean; error?: string }>({
    checking: apiConfig.mode !== "demo",
  });
  useEffect(() => {
    if (apiConfig.mode === "demo") return;
    let active = true;
    deelsApi.auth
      .me()
      .then(() => {
        if (active) setState({ checking: false });
      })
      .catch((error) => {
        if (!active) return;
        if (error instanceof ApiError && error.status === 401) {
          const next = encodeURIComponent(window.location.pathname);
          window.location.replace(`/login?next=${next}`);
          return;
        }
        setState({ checking: false, error: apiErrorText(error) });
      });
    return () => {
      active = false;
    };
  }, []);
  return state;
}

function ChallengesPage() {
  const filters = [
    "Все",
    "В тренде",
    "С призами",
    "Новые",
    "Танцы",
    "Музыка",
    "Спорт",
    "Добро",
  ];
  const [filter, setFilter] = useState("Все");
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [sort, setSort] = useState("popular");
  const [limit, setLimit] = useState(12);
  const fallback = useMemo(
    () =>
      demoContent.challenges
        .filter((item) => {
          const searchMatch =
            !submitted ||
            `${item.title} ${item.author} ${item.tag}`
              .toLowerCase()
              .includes(submitted.toLowerCase());
          const filterMatch =
            filter === "Все" || filter === "В тренде" || filter === "Новые"
              ? true
              : filter === "С призами"
                ? item.prize !== "0 ₽"
                : item.tag.toLowerCase() === filter.toLowerCase();
          return searchMatch && filterMatch;
        })
        .slice(0, limit),
    [filter, limit, submitted],
  );
  const params = {
    limit,
    q: submitted,
    sort,
    category: !["Все", "В тренде", "С призами", "Новые"].includes(filter)
      ? filter
      : undefined,
    trending: filter === "В тренде" || undefined,
    with_prize: filter === "С призами" || undefined,
    newest: filter === "Новые" || undefined,
  };
  const resource = useApiResource(
    `challenges:${filter}:${submitted}:${sort}:${limit}`,
    async () => (await deelsApi.challenges.list(params)).items,
    fallback,
  );
  return (
    <PageShell path="/challenges">
      <main>
        <CatalogHero
          eyebrow="Выбирай свой вызов"
          title="Челленджи"
          text="Тренды, творчество, спорт, музыка и добрые дела — найди идею, которую захочется повторить."
        >
          <form
            className="hero-search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              setLimit(12);
              setSubmitted(query.trim());
            }}
          >
            <Icon name="search" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Поиск челленджей"
              placeholder="Найти челлендж или автора"
            />
            <button type="submit">Найти</button>
          </form>
        </CatalogHero>
        <section className="section catalog-section">
          <div className="container">
            <Filters
              items={filters}
              value={filter}
              onChange={(value) => {
                setLimit(12);
                setFilter(value);
              }}
            />
            <StatusLine
              loading={resource.loading}
              error={resource.error}
              source={resource.source}
              onRetry={resource.refresh}
            />
            <div className="catalog-toolbar">
              <span>
                Найдено: {resource.data.length}
                {resource.data.length === limit ? "+" : ""}
              </span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Сортировка"
              >
                <option value="popular">Сначала популярные</option>
                <option value="newest">Сначала новые</option>
                <option value="prize">Призовой фонд</option>
              </select>
            </div>
            {resource.data.length ? (
              <div className="catalog-grid">
                {resource.data.map((item) => (
                  <ChallengeCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="empty-results">
                <h2>Ничего не найдено</h2>
                <p>Измените запрос или выберите другой фильтр.</p>
              </div>
            )}
            <button
              type="button"
              className="button button-soft load-more"
              onClick={() => setLimit((value) => value + 12)}
              disabled={resource.loading}
            >
              Показать ещё
            </button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function ChallengeDetail({ id }: { id: string }) {
  const fallback =
    demoContent.challenges.find((item) => item.id === id) ||
    demoContent.challenges[0];
  const resource = useApiResource(
    `challenge:${id}`,
    () => deelsApi.challenges.detail(id),
    fallback,
  );
  const item = resource.data;
  const [saved, setSaved] = useState(Boolean(item.saved));
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true);
    try {
      if (apiConfig.mode !== "demo") await deelsApi.challenges.save(item.id);
      setSaved((value) => !value);
    } finally {
      setSaving(false);
    }
  }
  return (
    <PageShell path="/challenges">
      <main>
        <section className="detail-hero">
          <div className="container">
            <StatusLine
              loading={resource.loading}
              error={resource.error}
              source={resource.source}
              onRetry={resource.refresh}
            />
          </div>
          <div className="container detail-grid">
            <div className={`detail-poster poster-${item.tone}`}>
              {item.mediaUrl ? (
                <video
                  src={item.mediaUrl}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={item.title}
                />
              ) : (
                <>
                  <span className="phone-live">Челлендж Deels</span>
                  <span className="detail-emoji">{item.emoji}</span>
                  <span className="play-button big">
                    <Icon name="play" />
                  </span>
                </>
              )}
              <div className="poster-caption">
                <span>@{item.author}</span>
                <strong>{item.title}</strong>
                <small>#{item.tag.toLowerCase()} #deels</small>
              </div>
            </div>
            <div className="detail-copy">
              <A href="/challenges" className="back-link">
                <Icon name="back" /> Все челленджи
              </A>
              <span className="eyebrow">
                <Icon name="spark" />{" "}
                {item.endsAt
                  ? `До ${new Date(item.endsAt).toLocaleDateString("ru-RU")}`
                  : "Участвовать можно сейчас"}
              </span>
              <h1>{item.title}</h1>
              <p>
                {item.description ||
                  "Снимите вертикальное видео, покажите свою версию и пригласите друзей поддержать вас."}
              </p>
              <div className="detail-stats">
                <div>
                  <strong>{item.prize}</strong>
                  <span>призовой фонд</span>
                </div>
                <div>
                  <strong>{item.participants}</strong>
                  <span>ответов</span>
                </div>
                <div>
                  <strong>{formatCount(item.likes)}</strong>
                  <span>поддержали</span>
                </div>
              </div>
              <div className="detail-actions">
                <A
                  href={`/challenges/${item.id}/respond`}
                  className="button button-primary"
                >
                  Принять участие <Icon name="arrow" />
                </A>
                <button
                  type="button"
                  disabled={saving}
                  aria-pressed={saved}
                  onClick={save}
                  className="button button-soft"
                >
                  <Icon name="heart" /> {saved ? "Сохранено" : "Сохранить"}
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container content-with-aside">
            <div className="content-card">
              <h2>Как участвовать</h2>
              <ol className="rules-list">
                <li>
                  <span>1</span>
                  <div>
                    <strong>Запишите ответ</strong>
                    <p>
                      Один участник — одно вертикальное видео длительностью до
                      30 секунд.
                    </p>
                  </div>
                </li>
                <li>
                  <span>2</span>
                  <div>
                    <strong>Проверьте права на звук</strong>
                    <p>
                      Используйте оригинальную аудиодорожку или музыку, на
                      которую у вас есть разрешение.
                    </p>
                  </div>
                </li>
                <li>
                  <span>3</span>
                  <div>
                    <strong>Собирайте голоса</strong>
                    <p>
                      Делитесь ссылкой, участвуйте честно и следите за
                      результатами.
                    </p>
                  </div>
                </li>
              </ol>
              <h2>Популярные ответы</h2>
              <div className="mini-video-grid">
                {demoContent.challenges.slice(1, 5).map((answer, index) => (
                  <button
                    type="button"
                    onClick={() => void deelsApi.challenges.vote(answer.id)}
                    key={answer.id}
                    className={`mini-video poster-${answer.tone}`}
                    aria-label={`Проголосовать за ответ ${answer.author}`}
                  >
                    <span className="rank">#{index + 1}</span>
                    <span>{answer.emoji}</span>
                    <small>
                      {["12,4K", "9,8K", "8,2K", "7,9K"][index]} голосов
                    </small>
                  </button>
                ))}
              </div>
            </div>
            <aside className="organizer-card">
              <span className="avatar">D</span>
              <div>
                <small>Организатор</small>
                <strong>{item.author}</strong>
                <span>@{item.author}</span>
              </div>
              <hr />
              <p>
                Организатор отвечает за условия, сроки и выдачу заявленного
                приза.
              </p>
              <A href="/profile" className="button button-soft">
                Открыть профиль
              </A>
            </aside>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function FeedPage() {
  const [tab, setTab] = useState<"for-you" | "following">("for-you");
  const resource = useApiResource(
    `feed:${tab}`,
    async () =>
      (
        await deelsApi.feed.list({
          limit: 12,
          following: tab === "following" || undefined,
        })
      ).items,
    demoContent.challenges,
  );
  const challenges = resource.data.length
    ? resource.data
    : demoContent.challenges;
  const [slide, setSlide] = useState(0);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState("");
  const touchStart = useRef<number | null>(null);
  const item = challenges[slide % challenges.length];
  const move = (direction: number) => {
    setSlide(
      (current) =>
        (current + direction + challenges.length) % challenges.length,
    );
    setCommentOpen(false);
    setFeedback("");
  };
  async function toggleLike() {
    const next = !liked[item.id];
    setLiked((current) => ({ ...current, [item.id]: next }));
    try {
      if (apiConfig.mode !== "demo") {
        if (next) await deelsApi.social.like("challenges", item.id);
        else await deelsApi.social.unlike("challenges", item.id);
      }
    } catch (error) {
      setLiked((current) => ({ ...current, [item.id]: !next }));
      setFeedback(apiErrorText(error));
    }
  }
  async function submitComment(event: FormEvent) {
    event.preventDefault();
    if (!comment.trim()) return;
    try {
      if (apiConfig.mode !== "demo")
        await deelsApi.social.comment("challenges", item.id, comment.trim());
      setComment("");
      setFeedback("Комментарий опубликован");
    } catch (error) {
      setFeedback(apiErrorText(error));
    }
  }
  async function share() {
    const url = `${window.location.origin}/challenges/${item.id}`;
    try {
      if (navigator.share) await navigator.share({ title: item.title, url });
      else await navigator.clipboard.writeText(url);
      if (apiConfig.mode !== "demo")
        await deelsApi.social.share("challenges", item.id);
      setFeedback(
        navigator.share ? "Спасибо, что делитесь" : "Ссылка скопирована",
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setFeedback(apiErrorText(error));
    }
  }
  return (
    <PageShell path="/feed" minimal>
      <main className="feed-page">
        <div className="feed-tabs" role="tablist" aria-label="Режим ленты">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "for-you"}
            onClick={() => setTab("for-you")}
            className={tab === "for-you" ? "active" : ""}
          >
            Для тебя
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "following"}
            onClick={() => setTab("following")}
            className={tab === "following" ? "active" : ""}
          >
            Подписки
          </button>
        </div>
        <div className="feed-layout">
          <aside className="feed-side-card">
            <h3>В тренде</h3>
            {challenges.slice(0, 4).map((challenge, index) => (
              <A href={`/challenges/${challenge.id}`} key={challenge.id}>
                <span>{index + 1}</span>
                <div>
                  <strong>#{challenge.tag.toLowerCase()}</strong>
                  <small>{challenge.participants} видео</small>
                </div>
              </A>
            ))}
          </aside>
          <section
            className={`feed-video poster-${item.tone}`}
            onTouchStart={(event) => {
              touchStart.current = event.changedTouches[0].clientY;
            }}
            onTouchEnd={(event) => {
              if (touchStart.current === null) return;
              const delta =
                event.changedTouches[0].clientY - touchStart.current;
              if (Math.abs(delta) > 48) move(delta < 0 ? 1 : -1);
              touchStart.current = null;
            }}
            aria-label={`Видео: ${item.title}`}
          >
            {item.mediaUrl ? (
              <video
                key={item.mediaUrl}
                src={item.mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <span className="feed-emoji">{item.emoji}</span>
            )}
            <div className="phone-top">
              <Brand />
              <A href="/search" aria-label="Поиск">
                <Icon name="search" />
              </A>
            </div>
            <div className="phone-side">
              <button
                type="button"
                aria-pressed={Boolean(liked[item.id])}
                className={liked[item.id] ? "active" : ""}
                onClick={toggleLike}
              >
                <Icon name="heart" />
                <small>
                  {formatCount((item.likes || 8200) + (liked[item.id] ? 1 : 0))}
                </small>
              </button>
              <button
                type="button"
                aria-expanded={commentOpen}
                onClick={() => setCommentOpen((value) => !value)}
              >
                <Icon name="comment" />
                <small>{formatCount(item.comments || 462)}</small>
              </button>
              <button type="button" onClick={share}>
                <Icon name="share" />
                <small>{formatCount(item.shares || 92)}</small>
              </button>
            </div>
            <div className="feed-caption">
              <strong>@{item.author}</strong>
              <h2>{item.title}</h2>
              <p>
                {item.description ||
                  `Покажи свою версию и участвуй в розыгрыше ${item.prize}.`}
              </p>
              <A href={`/challenges/${item.id}`}>
                Открыть челлендж <Icon name="arrow" />
              </A>
              {commentOpen && (
                <form className="feed-comment" onSubmit={submitComment}>
                  <label className="sr-only" htmlFor="feed-comment">
                    Комментарий
                  </label>
                  <input
                    id="feed-comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    maxLength={500}
                    placeholder="Написать комментарий"
                  />
                  <button type="submit" aria-label="Отправить комментарий">
                    <Icon name="arrow" />
                  </button>
                </form>
              )}
              {feedback && (
                <p className="feed-feedback" role="status">
                  {feedback}
                </p>
              )}
              <StatusLine
                loading={resource.loading}
                error={resource.error}
                source={resource.source}
              />
            </div>
            <div className="feed-switch">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Предыдущее видео"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Следующее видео"
              >
                ↓
              </button>
            </div>
          </section>
          <aside className="feed-side-card">
            <h3>Продолжить</h3>
            <p>
              Войдите, чтобы сохранять видео, голосовать и подписываться на
              авторов.
            </p>
            <A href="/login" className="button button-primary">
              Войти
            </A>
            <A href="/register" className="text-link">
              Создать аккаунт
            </A>
          </aside>
        </div>
      </main>
    </PageShell>
  );
}

function BattlesPage() {
  const [filter, setFilter] = useState("Сейчас");
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const status = filter === "Завершённые" ? "finished" : "active";
  const fallback = demoBattles.filter((battle) =>
    status === "active" ? battle.status === "active" : true,
  );
  const resource = useApiResource(
    `battles:${filter}`,
    async () =>
      (
        await deelsApi.battles.list({
          status,
          mine: filter === "Мои баттлы" || undefined,
        })
      ).items,
    fallback,
  );
  async function vote(battle: BattleView, sideId: string) {
    if (battle.status === "finished" || votes[battle.id] || battle.votedSideId)
      return;
    setError("");
    setVotes((current) => ({ ...current, [battle.id]: sideId }));
    try {
      if (apiConfig.mode !== "demo")
        await deelsApi.battles.vote(battle.id, sideId);
    } catch (caught) {
      setVotes((current) => {
        const next = { ...current };
        delete next[battle.id];
        return next;
      });
      setError(apiErrorText(caught));
    }
  }
  return (
    <PageShell path="/battles">
      <main>
        <CatalogHero
          eyebrow="Два ответа — один победитель"
          title="Баттлы"
          text="Смотри пары видео и выбирай, чей ответ сильнее. Один голос может изменить финал."
        />
        <section className="section">
          <div className="container">
            <Filters
              items={["Сейчас", "Завершённые", "Мои баттлы"]}
              value={filter}
              onChange={setFilter}
            />
            <StatusLine
              loading={resource.loading}
              error={resource.error || error}
              source={resource.source}
            />
            <div className="battles-grid">
              {resource.data.map((battle) => {
                const selected = votes[battle.id] || battle.votedSideId;
                return (
                  <article className="battle-card" key={battle.id}>
                    <div className="battle-head">
                      <span>{battle.round}</span>
                      <strong>{battle.title}</strong>
                      <small>
                        {battle.status === "finished"
                          ? "завершён"
                          : battle.endsIn
                            ? `осталось ${battle.endsIn}`
                            : "голосование открыто"}
                      </small>
                    </div>
                    <div className="versus-grid">
                      <button
                        type="button"
                        disabled={
                          Boolean(selected) || battle.status === "finished"
                        }
                        aria-pressed={selected === battle.sides[0].id}
                        onClick={() => vote(battle, battle.sides[0].id)}
                        className={`battle-side poster-${battle.sides[0].tone} ${selected === battle.sides[0].id ? "selected" : ""}`}
                      >
                        {battle.sides[0].mediaUrl ? (
                          <video
                            src={battle.sides[0].mediaUrl}
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <span>{battle.sides[0].emoji}</span>
                        )}
                        <strong>@{battle.sides[0].author}</strong>
                        <small>{battle.sides[0].percent}%</small>
                      </button>
                      <b>VS</b>
                      <button
                        type="button"
                        disabled={
                          Boolean(selected) || battle.status === "finished"
                        }
                        aria-pressed={selected === battle.sides[1].id}
                        onClick={() => vote(battle, battle.sides[1].id)}
                        className={`battle-side poster-${battle.sides[1].tone} ${selected === battle.sides[1].id ? "selected" : ""}`}
                      >
                        {battle.sides[1].mediaUrl ? (
                          <video
                            src={battle.sides[1].mediaUrl}
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <span>{battle.sides[1].emoji}</span>
                        )}
                        <strong>@{battle.sides[1].author}</strong>
                        <small>{battle.sides[1].percent}%</small>
                      </button>
                    </div>
                    <p>
                      {battle.totalVotes.toLocaleString("ru-RU")} голосов •{" "}
                      {selected
                        ? "Ваш голос принят"
                        : battle.status === "finished"
                          ? "Результат зафиксирован"
                          : "Нажмите на видео, чтобы выбрать"}
                    </p>
                  </article>
                );
              })}
            </div>
            {!resource.data.length && (
              <div className="empty-results">
                <h2>Баттлов пока нет</h2>
                <p>Выберите другой раздел или вернитесь позже.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function BattleDetail({ id }: { id: string }) {
  const fallback = demoBattles.find((item) => item.id === id) || demoBattles[0];
  const resource = useApiResource(
    `battle:${id}`,
    () => deelsApi.battles.detail(id),
    fallback,
  );
  const battle = resource.data;
  const [selected, setSelected] = useState(battle.votedSideId || "");
  const [feedback, setFeedback] = useState("");

  async function vote(sideId: string) {
    if (selected || battle.status === "finished") return;
    setSelected(sideId);
    setFeedback("");
    try {
      if (apiConfig.mode !== "demo") await deelsApi.battles.vote(battle.id, sideId);
      setFeedback("Ваш голос принят");
    } catch (error) {
      setSelected("");
      setFeedback(apiErrorText(error));
    }
  }

  return (
    <PageShell path="/battles">
      <main>
        <section className="detail-hero">
          <div className="container">
            <StatusLine loading={resource.loading} error={resource.error} source={resource.source} onRetry={resource.refresh} />
            <A href="/battles" className="back-link"><Icon name="back" /> Все баттлы</A>
            <article className="battle-card battle-detail-card">
              <div className="battle-head">
                <span>{battle.round}</span><h1>{battle.title}</h1>
                <small>{battle.status === "finished" ? "Баттл завершён" : battle.endsIn ? `Осталось ${battle.endsIn}` : "Голосование открыто"}</small>
              </div>
              <div className="versus-grid">
                {battle.sides.map((side, index) => (
                  <Fragment key={side.id}>
                    {index === 1 && <b>VS</b>}
                    <button type="button" disabled={Boolean(selected) || battle.status === "finished"} aria-pressed={selected === side.id} onClick={() => vote(side.id)} className={`battle-side poster-${side.tone} ${selected === side.id ? "selected" : ""}`}>
                      {side.mediaUrl ? <video src={side.mediaUrl} controls playsInline preload="metadata" /> : <span>{side.emoji}</span>}
                      <strong>@{side.author}</strong><small>{side.percent}%</small>
                    </button>
                  </Fragment>
                ))}
              </div>
              <p role="status">{feedback || `${battle.totalVotes.toLocaleString("ru-RU")} голосов`}</p>
            </article>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function StoriesPage() {
  const [filter, setFilter] = useState("Все истории");
  const [limit, setLimit] = useState(12);
  const fallback = demoContent.stories
    .filter(
      (item) =>
        filter === "Все истории" ||
        item.title.toLowerCase().includes(filter.toLowerCase()),
    )
    .slice(0, limit);
  const resource = useApiResource(
    `stories:${filter}:${limit}`,
    async () =>
      (
        await deelsApi.stories.list({
          limit,
          category: filter === "Все истории" ? undefined : filter,
        })
      ).items,
    fallback,
  );
  return (
    <PageShell path="/stories">
      <main>
        <CatalogHero
          eyebrow="Люди и их поворотные моменты"
          title="Истории"
          text="Честные видео о маленьких шагах, сильных решениях и переменах, которыми хочется делиться."
        />
        <section className="section">
          <div className="container">
            <Filters
              items={[
                "Все истории",
                "Вдохновение",
                "Творчество",
                "Люди",
                "Путешествия",
              ]}
              value={filter}
              onChange={(value) => {
                setLimit(12);
                setFilter(value);
              }}
            />
            <StatusLine
              loading={resource.loading}
              error={resource.error}
              source={resource.source}
              onRetry={resource.refresh}
            />
            <div className="stories-catalog">
              {resource.data.map((item) => (
                <StoryCard key={item.id} item={item} />
              ))}
            </div>
            {!resource.data.length && (
              <div className="empty-results">
                <h2>Историй пока нет</h2>
                <p>Попробуйте выбрать другую тему.</p>
              </div>
            )}
            <button
              type="button"
              className="button button-soft load-more"
              onClick={() => setLimit((value) => value + 12)}
            >
              Показать ещё
            </button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function StoryDetail({ id }: { id: string }) {
  const fallback =
    demoContent.stories.find((item) => item.id === id) ||
    demoContent.stories[0];
  const storyListResource = useApiResource(
    "story-viewer-list",
    async () => (await deelsApi.stories.list({ limit: 30 })).items,
    demoContent.stories,
  );
  const storyDeck = useMemo(() => {
    const items = storyListResource.data;
    return items.some((item) => item.id === id) ? items : [fallback, ...items];
  }, [fallback, id, storyListResource.data]);
  const [currentId, setCurrentId] = useState(id);
  const currentIndex = Math.max(
    0,
    storyDeck.findIndex((item) => item.id === currentId),
  );
  const currentSummary = storyDeck[currentIndex] || fallback;
  const resource = useApiResource(
    `story:${currentSummary.id}`,
    () => deelsApi.stories.detail(currentSummary.id),
    currentSummary,
  );
  const story =
    resource.data.id === currentSummary.id ? resource.data : currentSummary;
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const lastWheelAt = useRef(0);

  function showStory(index: number) {
    if (storyDeck.length < 2) return;
    const normalizedIndex =
      (index + storyDeck.length) % storyDeck.length;
    const nextStory = storyDeck[normalizedIndex];
    setLiked(false);
    setFollowing(false);
    setFeedback("");
    setCurrentId(nextStory.id);
    window.history.replaceState({}, "", `/stories/${nextStory.id}`);
  }

  function showPreviousStory() {
    showStory(currentIndex - 1);
  }

  function showNextStory() {
    showStory(currentIndex + 1);
  }

  function startStorySwipe(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button, video")) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function finishStorySwipe(event: ReactPointerEvent<HTMLDivElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    if (deltaX < 0) showNextStory();
    else showPreviousStory();
  }

  function scrollStories(event: ReactWheelEvent<HTMLDivElement>) {
    const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;
    if (Math.abs(movement) < 24) return;
    const now = Date.now();
    if (now - lastWheelAt.current < 550) return;
    lastWheelAt.current = now;
    event.preventDefault();
    if (movement > 0) showNextStory();
    else showPreviousStory();
  }

  async function like() {
    const next = !liked;
    setLiked(next);
    try {
      if (apiConfig.mode !== "demo") {
        if (next) await deelsApi.social.like("stories", story.id);
        else await deelsApi.social.unlike("stories", story.id);
      }
    } catch (error) {
      setLiked(!next);
      setFeedback(apiErrorText(error));
    }
  }
  async function share() {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: story.title, url });
    else await navigator.clipboard.writeText(url);
    if (apiConfig.mode !== "demo")
      await deelsApi.social.share("stories", story.id);
    setFeedback("Ссылка готова для отправки");
  }
  return (
    <PageShell path="/stories">
      <main>
        <section className="story-detail theme-dark-card">
          <div className="container">
            <StatusLine
              loading={resource.loading}
              error={resource.error}
              source={resource.source}
              onRetry={resource.refresh}
            />
          </div>
          <div className="container story-detail-grid">
            <div className="story-viewer-shell">
              <button
                type="button"
                className="story-nav story-nav-previous"
                onClick={showPreviousStory}
                aria-label="Предыдущая история"
                disabled={storyDeck.length < 2}
              >
                <span aria-hidden="true">‹</span>
              </button>
              <div
                className={`story-player poster-${story.tone}`}
                onPointerDown={startStorySwipe}
                onPointerUp={finishStorySwipe}
                onPointerCancel={() => {
                  pointerStart.current = null;
                }}
                onWheel={scrollStories}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") showPreviousStory();
                  if (event.key === "ArrowRight") showNextStory();
                  if (event.key === "Home") showStory(0);
                  if (event.key === "End") showStory(storyDeck.length - 1);
                }}
                role="region"
                aria-roledescription="просмотрщик историй"
                aria-label={`${story.title}. История ${currentIndex + 1} из ${storyDeck.length}`}
                tabIndex={0}
              >
                <div className="story-progress" aria-label="Выбор истории">
                  {storyDeck.map((item, index) => (
                    <button
                      type="button"
                      key={item.id}
                      className={index === currentIndex ? "active" : ""}
                      onClick={(event) => {
                        event.stopPropagation();
                        showStory(index);
                      }}
                      aria-label={`Открыть историю ${index + 1}: ${item.title}`}
                      aria-current={index === currentIndex ? "true" : undefined}
                    />
                  ))}
                </div>
                <div className="story-frame" key={story.id} aria-live="polite">
                  {story.mediaUrl ? (
                    <video
                      src={story.mediaUrl}
                      controls
                      playsInline
                      preload="metadata"
                      aria-label={story.title}
                    />
                  ) : (
                    <>
                      <span className="phone-live">История • {story.time}</span>
                      <span className="detail-emoji">{story.emoji}</span>
                      <span className="play-button big">
                        <Icon name="play" />
                      </span>
                    </>
                  )}
                </div>
                <div className="story-swipe-hint" aria-hidden="true">
                  <span>←</span> Свайпните <span>→</span>
                </div>
              </div>
              <button
                type="button"
                className="story-nav story-nav-next"
                onClick={showNextStory}
                aria-label="Следующая история"
                disabled={storyDeck.length < 2}
              >
                <span aria-hidden="true">›</span>
              </button>
              <span className="story-position" aria-live="polite">
                {currentIndex + 1} / {storyDeck.length}
              </span>
            </div>
            <div>
              <A href="/stories" className="back-link light">
                <Icon name="back" /> Все истории
              </A>
              <span className="eyebrow">Личный опыт</span>
              <h1>{story.title}</h1>
              <p>
                {story.description ||
                  "Честная история о шаге, который изменил жизнь и вдохновил других участников Deels."}
              </p>
              <div className="author-row">
                <span className="avatar">
                  {story.author.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <strong>{story.author}</strong>
                  <span>
                    @{story.author.replace(/\s+/g, ".").toLowerCase()}
                  </span>
                </div>
                <button
                  type="button"
                  aria-pressed={following}
                  onClick={async () => {
                    setFollowing((value) => !value);
                    if (apiConfig.mode !== "demo")
                      await deelsApi.social.follow(story.author);
                  }}
                  className="button button-white button-small"
                >
                  {following ? "Вы подписаны" : "Подписаться"}
                </button>
              </div>
              <div className="detail-actions">
                <button
                  type="button"
                  aria-pressed={liked}
                  onClick={like}
                  className="button button-glass"
                >
                  <Icon name="heart" />{" "}
                  {formatCount((story.likes || 12800) + (liked ? 1 : 0))}
                </button>
                <A
                  href={`/stories/${story.id}#comments`}
                  className="button button-glass"
                >
                  <Icon name="comment" /> {formatCount(story.comments || 486)}
                </A>
                <button
                  type="button"
                  onClick={share}
                  className="button button-glass"
                >
                  <Icon name="share" /> Поделиться
                </button>
              </div>
              {feedback && (
                <p className="feed-feedback" role="status">
                  {feedback}
                </p>
              )}
            </div>
          </div>
        </section>
        <section className="section" id="comments">
          <div className="container narrow-copy">
            <span className="eyebrow">После публикации</span>
            <h2>Истории получают продолжение в сообществе</h2>
            <p>
              Обсуждайте публикацию бережно, делитесь собственным опытом и
              поддерживайте автора без давления и токсичности.
            </p>
            <form
              className="inline-action-form"
              onSubmit={async (event) => {
                event.preventDefault();
                const field = event.currentTarget.elements.namedItem(
                  "comment",
                ) as HTMLInputElement;
                if (!field.value.trim()) return;
                if (apiConfig.mode !== "demo")
                  await deelsApi.social.comment(
                    "stories",
                    story.id,
                    field.value.trim(),
                  );
                field.value = "";
                setFeedback("Комментарий опубликован");
              }}
            >
              <label>
                Комментарий
                <input
                  name="comment"
                  maxLength={500}
                  placeholder="Напишите автору"
                />
              </label>
              <button type="submit" className="button button-primary">
                Отправить
              </button>
            </form>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function CampaignsPage() {
  const [filter, setFilter] = useState("Все");
  const [limit, setLimit] = useState(12);
  const fallback = demoContent.campaigns
    .filter(
      (item) =>
        filter === "Все" ||
        item.title.toLowerCase().includes(filter.toLowerCase()),
    )
    .slice(0, limit);
  const resource = useApiResource(
    `campaigns:${filter}:${limit}`,
    async () =>
      (
        await deelsApi.campaigns.list({
          limit,
          category: filter === "Все" ? undefined : filter,
          verified: true,
        })
      ).items,
    fallback,
  );
  return (
    <PageShell path="/campaigns">
      <main>
        <CatalogHero
          eyebrow="Поддержка в одно касание"
          title="Копилки"
          text="Проверенные сборы от людей и организаций. Следи за прогрессом и вместе с сообществом приближай цель."
        />
        <section className="section">
          <div className="container">
            <Filters
              items={[
                "Все",
                "Срочные",
                "Дети",
                "Животные",
                "Творчество",
                "Проекты",
              ]}
              value={filter}
              onChange={(value) => {
                setLimit(12);
                setFilter(value);
              }}
            />
            <StatusLine
              loading={resource.loading}
              error={resource.error}
              source={resource.source}
              onRetry={resource.refresh}
            />
            <div className="campaign-grid large">
              {resource.data.map((item) => (
                <CampaignCard key={item.id} item={item} />
              ))}
            </div>
            {!resource.data.length && (
              <div className="empty-results">
                <h2>Сборы не найдены</h2>
                <p>Попробуйте выбрать другую категорию.</p>
              </div>
            )}
            <button
              type="button"
              className="button button-soft load-more"
              onClick={() => setLimit((value) => value + 12)}
            >
              Показать ещё
            </button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function CampaignDetail({ id }: { id: string }) {
  const [amount, setAmount] = useState("1000");
  const [anonymous, setAnonymous] = useState(false);
  const [donating, setDonating] = useState(false);
  const [feedback, setFeedback] = useState("");
  const fallback =
    demoContent.campaigns.find((item) => item.id === id) ||
    demoContent.campaigns[0];
  const resource = useApiResource(
    `campaign:${id}`,
    () => deelsApi.campaigns.detail(id),
    fallback,
  );
  const campaign = resource.data;
  async function donate() {
    const value = Number(amount.replace(/\D/g, ""));
    if (!Number.isFinite(value) || value < 10) {
      setFeedback("Минимальная сумма поддержки — 10 ₽");
      return;
    }
    setDonating(true);
    setFeedback("");
    try {
      if (apiConfig.mode !== "demo") {
        const result = await deelsApi.campaigns.donate(
          campaign.id,
          value,
          anonymous,
        );
        const redirect =
          typeof result.payment_url === "string"
            ? result.payment_url
            : typeof result.redirect_url === "string"
              ? result.redirect_url
              : "";
        if (redirect) {
          window.location.assign(redirect);
          return;
        }
      }
      setFeedback("Спасибо! Поддержка принята.");
      resource.refresh();
    } catch (error) {
      setFeedback(apiErrorText(error));
    } finally {
      setDonating(false);
    }
  }
  return (
    <PageShell path="/campaigns">
      <main>
        <section className="detail-hero">
          <div className="container">
            <StatusLine
              loading={resource.loading}
              error={resource.error}
              source={resource.source}
              onRetry={resource.refresh}
            />
          </div>
          <div className="container campaign-detail-grid">
            <div className={`campaign-detail-cover poster-${campaign.tone}`}>
              {campaign.mediaUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Laravel may return any approved media CDN at runtime.
                <img
                  src={campaign.mediaUrl}
                  alt={`Обложка сбора «${campaign.title}»`}
                  decoding="async"
                  fetchPriority="high"
                />
              ) : (
                <span>{campaign.emoji}</span>
              )}
              <div>
                <small>
                  {campaign.verified
                    ? "Проверенная копилка"
                    : "Копилка на модерации"}
                </small>
                <strong>
                  Каждый шаг
                  <br />
                  имеет значение
                </strong>
              </div>
            </div>
            <div className="detail-copy">
              <A href="/campaigns" className="back-link">
                <Icon name="back" /> Все копилки
              </A>
              <span className="eyebrow">
                <Icon name="check" />{" "}
                {campaign.verified
                  ? "Документы проверены Deels"
                  : "Статус проверки отображается в карточке"}
              </span>
              <h1>{campaign.title}</h1>
              <p>
                {campaign.description ||
                  "Средства направляются на заявленную цель. Следите за обновлениями и отчётами организатора."}
              </p>
              <div className="progress-line big">
                <span style={{ width: `${campaign.raised}%` }} />
              </div>
              <div className="campaign-numbers">
                <div>
                  <strong>{campaign.sum}</strong>
                  <span>собрано</span>
                </div>
                <div>
                  <strong>{campaign.goal}</strong>
                  <span>цель</span>
                </div>
              </div>
              <div className="donate-box">
                <div className="amount-row">
                  {["500", "1000", "3000"].map((value) => (
                    <button
                      type="button"
                      className={amount === value ? "active" : ""}
                      onClick={() => setAmount(value)}
                      key={value}
                    >
                      {Number(value).toLocaleString("ru-RU")} ₽
                    </button>
                  ))}
                  <label>
                    <input
                      inputMode="numeric"
                      value={amount}
                      onChange={(event) =>
                        setAmount(event.target.value.replace(/\D/g, ""))
                      }
                      aria-label="Другая сумма"
                    />
                    <span>₽</span>
                  </label>
                </div>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(event) => setAnonymous(event.target.checked)}
                  />{" "}
                  Поддержать анонимно
                </label>
                <button
                  type="button"
                  disabled={donating}
                  onClick={donate}
                  className="button button-primary"
                >
                  {donating
                    ? "Переходим к оплате…"
                    : `Поддержать на ${Number(amount || 0).toLocaleString("ru-RU")} ₽`}
                </button>
                <small>
                  Перед оплатой вы увидите итоговую сумму и условия платёжного
                  партнёра.
                </small>
                {feedback && (
                  <p className="form-error" role="status">
                    {feedback}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container content-with-aside">
            <article className="content-card prose">
              <h2>О сборе</h2>
              <p>
                {campaign.description ||
                  "Организатор публикует сведения о цели, подтверждающие документы и обновления о ходе сбора."}
              </p>
              <div className="quote-card">
                Прозрачность сбора: проверка документов, история операций и
                отчёты организатора.
              </div>
              <h2>Безопасность поддержки</h2>
              <p>
                Платёж проходит через подключённого провайдера. Deels не хранит
                полные реквизиты банковской карты.
              </p>
            </article>
            <aside className="organizer-card">
              <span className="avatar">
                {(campaign.organizer || "D").slice(0, 2).toUpperCase()}
              </span>
              <div>
                <small>Организатор</small>
                <strong>{campaign.organizer || "Пользователь Deels"}</strong>
                <span>
                  {campaign.verified
                    ? "Личность подтверждена • ✓"
                    : "Проверка продолжается"}
                </span>
              </div>
              <hr />
              <p>
                Вопросы по сбору можно направить организатору через защищённый
                чат.
              </p>
              <A href="/messages" className="button button-soft">
                <Icon name="message" /> Написать
              </A>
            </aside>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function AboutPage() {
  const { data: stats } = useApiResource(
    "about-stats",
    () => deelsApi.stats.summary(),
    demoStats,
  );
  return (
    <PageShell path="/about-us">
      <main>
        <section className="about-hero theme-gradient">
          <div className="container">
            <span className="eyebrow">
              <Icon name="spark" /> О проекте
            </span>
            <h1>
              Deels — пространство,
              <br />
              где <em>идея объединяет</em>
            </h1>
            <p>
              Мы строим социальную сеть, в которой ценится не идеальная
              картинка, а желание участвовать, пробовать и поддерживать друг
              друга.
            </p>
            <div className="about-numbers">
              <div>
                <strong>{stats.creators}</strong>
                <span>авторов</span>
              </div>
              <div>
                <strong>{stats.responses}</strong>
                <span>видеоответов</span>
              </div>
              <div>
                <strong>{stats.votes}</strong>
                <span>голосов</span>
              </div>
              <div>
                <strong>{stats.campaigns}</strong>
                <span>в копилках</span>
              </div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container values-grid">
            <article>
              <span>01</span>
              <h3>Создавать проще</h3>
              <p>Одна идея, одно короткое видео и понятная механика участия.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Поддержка важнее</h3>
              <p>
                Голосование, честная модерация и сообщество без токсичности.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Результат заметен</h3>
              <p>Призы, новые знакомства, аудитория и реальные добрые дела.</p>
            </article>
          </div>
        </section>
        <section className="section section-tint">
          <div className="container split-feature">
            <div>
              <span className="eyebrow">Наша миссия</span>
              <h2>
                Помочь каждому
                <br />
                сделать первый шаг
              </h2>
            </div>
            <div className="big-copy">
              Мы верим, что творчество становится сильнее, когда получает
              отклик. Deels соединяет авторов, зрителей, бренды и социальные
              проекты вокруг простого действия —{" "}
              <strong>сделать и поделиться.</strong>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const payload = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    );
    try {
      if (apiConfig.mode !== "demo") await deelsApi.contacts.send(payload);
      setSent(true);
    } catch (caught) {
      setError(apiErrorText(caught));
    } finally {
      setLoading(false);
    }
  }
  return (
    <PageShell path="/contact-us">
      <main>
        <CatalogHero
          eyebrow="Мы на связи"
          title="Контакты"
          text="Расскажите о задаче — команда Deels ответит и поможет найти правильный формат."
        />
        <section className="section">
          <div className="container contact-grid">
            <div className="contact-list">
              <article>
                <span>Общие вопросы и поддержка</span>
                <a href="mailto:info@deels.ru">info@deels.ru</a>
                <p>О продукте, аккаунте и возможностях платформы.</p>
              </article>
              <article>
                <span>Телефон</span>
                <a href="tel:+78125079808">+7 (812) 507-98-08</a>
                <p>Каждый рабочий день с 09:00 до 18:00 МСК.</p>
              </article>
              <article>
                <span>Адрес</span>
                <strong>Санкт-Петербург, пр. Ветеранов, 166, лит. А</strong>
                <p>Юридический и почтовый адрес компании.</p>
              </article>
            </div>
            <form className="form-card" onSubmit={submit}>
              <h2>{sent ? "Сообщение отправлено" : "Написать команде"}</h2>
              {sent ? (
                <div className="success-state">
                  <span>
                    <Icon name="check" />
                  </span>
                  <p>
                    Спасибо! Мы ответим на указанный e‑mail в течение рабочего
                    дня.
                  </p>
                  <button
                    className="button button-soft"
                    type="button"
                    onClick={() => setSent(false)}
                  >
                    Отправить ещё
                  </button>
                </div>
              ) : (
                <>
                  <div className="form-two">
                    <label>
                      Имя
                      <input required name="first_name" placeholder="Имя" />
                    </label>
                    <label>
                      Фамилия
                      <input name="last_name" placeholder="Фамилия" />
                    </label>
                  </div>
                  <label>
                    E‑mail
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                    />
                  </label>
                  <label>
                    Номер телефона
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+7 (999) 000-00-00"
                    />
                  </label>
                  <label>
                    Сообщение
                    <textarea
                      required
                      name="message"
                      rows={5}
                      placeholder="Расскажите подробнее"
                    />
                  </label>
                  <label className="check-label">
                    <input required name="consent" value="1" type="checkbox" />{" "}
                    Я согласен на обработку данных по{" "}
                    <A href="/documents/privacy">политике конфиденциальности</A>
                  </label>
                  {error && (
                    <p className="form-error" role="alert">
                      {error}
                    </p>
                  )}
                  <button
                    disabled={loading}
                    className="button button-primary"
                    type="submit"
                  >
                    {loading ? (
                      "Отправляем…"
                    ) : (
                      <>
                        Отправить сообщение <Icon name="arrow" />
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          </div>
        </section>
        <section className="section section-tint">
          <div className="container company-details">
            <div>
              <span className="eyebrow">Реквизиты</span>
              <h2>ООО «КТС-ИМПОРТ»</h2>
              <p>Официальные данные владельца платформы Deels.</p>
            </div>
            <dl>
              <div>
                <dt>ИНН / КПП</dt>
                <dd>7807396346 / 780701001</dd>
              </div>
              <div>
                <dt>ОГРН</dt>
                <dd>1147847408235</dd>
              </div>
              <div>
                <dt>Расчётный счёт</dt>
                <dd>40702810755240005617</dd>
              </div>
              <div>
                <dt>Банк</dt>
                <dd>СЕВЕРО-ЗАПАДНЫЙ БАНК ПАО СБЕРБАНК</dd>
              </div>
              <div>
                <dt>БИК / корр. счёт</dt>
                <dd>044030653 / 30101810500000000653</dd>
              </div>
              <div>
                <dt>Генеральный директор</dt>
                <dd>Серебряков Сергей Николаевич</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function OfferPage({ slug = "terms" }: { slug?: string }) {
  const document = getLegalDocument(slug);
  return (
    <PageShell path={slug === "terms" ? "/offer" : `/documents/${slug}`}>
      <main>
        <CatalogHero
          eyebrow="Правила и прозрачность"
          title="Документы"
          text="Все условия использования Deels доступны как индексируемые веб‑страницы и в исходных файлах."
        />
        <section className="section">
          <div className="container documents-grid">
            <aside className="docs-nav" aria-label="Юридические документы">
              {legalDocuments.map((item) => (
                <A
                  key={item.slug}
                  href={
                    item.slug === "terms" ? "/offer" : `/documents/${item.slug}`
                  }
                  className={item.slug === document.slug ? "active" : ""}
                >
                  {item.shortTitle}
                </A>
              ))}
            </aside>
            <article className="content-card docs-content">
              <span>{document.version}</span>
              <h1>{document.title}</h1>
              <p>{document.summary}</p>
              <nav className="legal-toc" aria-label="Содержание">
                {document.sections.map((section, index) => (
                  <a href={`#legal-section-${index + 1}`} key={section.title}>
                    {section.title}
                  </a>
                ))}
              </nav>
              {document.sections.map((section, index) => (
                <section id={`legal-section-${index + 1}`} key={section.title}>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
              <section className="legal-source">
                <h2>Официальная версия</h2>
                <p>
                  Перед запуском юридическая служба утверждает редакцию и дату
                  документа. Веб‑версия должна совпадать с подписанной версией
                  без сокращений.
                </p>
                {document.sourceUrl && (
                  <a
                    href={document.sourceUrl}
                    rel="nofollow"
                    className="button button-soft"
                  >
                    Скачать действующий исходный документ
                  </a>
                )}
              </section>
            </article>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function AuthPage({ mode }: { mode: "login" | "register" }) {
  const register = mode === "register";
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") || "");
    const confirmation = String(data.get("password_confirmation") || "");
    if (register && password !== confirmation) {
      setError("Пароли не совпадают");
      setSubmitting(false);
      return;
    }
    try {
      if (apiConfig.mode !== "demo") {
        if (register) {
          const result = await deelsApi.auth.register({
            name: String(data.get("name") || ""),
            email: String(data.get("login") || ""),
            password,
            passwordConfirmation: confirmation,
            termsAccepted: data.get("terms") === "on",
            privacyAccepted: data.get("privacy") === "on",
            contentRulesAccepted: data.get("content_rules") === "on",
            marketingAccepted: data.get("marketing") === "on",
          });
          if (result.emailVerificationRequired) {
            setVerificationSent(true);
            return;
          }
        } else {
          await deelsApi.auth.login({
            login: String(data.get("login") || ""),
            password,
            remember: data.get("remember") === "on",
          });
        }
      }
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.assign(next?.startsWith("/") ? next : "/profile");
    } catch (caught) {
      setError(apiErrorText(caught));
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <PageShell path={`/${mode}`} minimal standalone>
      <main className="auth-page theme-gradient">
        <div className="auth-visual theme-dark-card">
          <Brand />
          <span className="eyebrow">
            <Icon name="spark" /> Добро пожаловать в движение
          </span>
          <h1>
            Создавай.
            <br />
            Участвуй.
            <br />
            <em>Вдохновляй.</em>
          </h1>
          <div className="auth-bubbles">
            <span>🕺</span>
            <span>🎤</span>
            <span>🏆</span>
          </div>
        </div>
        <div className="auth-form-wrap">
          <form className="auth-card" onSubmit={submit}>
            <div className="mobile-auth-brand">
              <Brand />
            </div>
            {verificationSent ? (
              <div className="success-state recovery-success">
                <span>
                  <Icon name="check" />
                </span>
                <h2>Подтвердите e‑mail</h2>
                <p>
                  Мы отправили письмо со ссылкой. После подтверждения аккаунт
                  будет полностью активирован.
                </p>
                <button
                  type="button"
                  className="button button-soft full"
                  onClick={async () => {
                    if (apiConfig.mode !== "demo")
                      await deelsApi.auth.resendVerification();
                  }}
                >
                  Отправить письмо повторно
                </button>
                <A href="/login" className="button button-primary full">
                  Перейти ко входу
                </A>
              </div>
            ) : (
              <>
                <span className="eyebrow">
                  {register ? "Новый аккаунт" : "С возвращением"}
                </span>
                <h2>{register ? "Регистрация в Deels" : "Войти в Deels"}</h2>
                <p>
                  {register
                    ? "Присоединяйтесь к авторам и зрителям."
                    : "Продолжайте с того места, где остановились."}
                </p>
                {register && (
                  <label>
                    Имя
                    <input
                      required
                      name="name"
                      autoComplete="name"
                      placeholder="Как вас зовут"
                    />
                  </label>
                )}
                <label>
                  E‑mail или телефон
                  <input
                    required
                    name="login"
                    autoComplete={register ? "email" : "username"}
                    inputMode={register ? "email" : "text"}
                    placeholder={
                      register ? "name@example.com" : "+7 999 000-00-00"
                    }
                  />
                </label>
                <label>
                  Пароль
                  <div className="password-field">
                    <input
                      required
                      minLength={8}
                      name="password"
                      autoComplete={
                        register ? "new-password" : "current-password"
                      }
                      type="password"
                      placeholder="Не менее 8 символов"
                    />
                  </div>
                </label>
                {register && (
                  <>
                    <label>
                      Повторите пароль
                      <input
                        required
                        minLength={8}
                        name="password_confirmation"
                        autoComplete="new-password"
                        type="password"
                        placeholder="Ещё раз пароль"
                      />
                    </label>
                    <fieldset className="consent-list">
                      <legend>Обязательные согласия</legend>
                      <label className="check-label">
                        <input required name="terms" type="checkbox" /> Я
                        принимаю <A href="/offer">условия использования</A>
                      </label>
                      <label className="check-label">
                        <input required name="privacy" type="checkbox" /> Я
                        принимаю{" "}
                        <A href="/documents/privacy">
                          политику конфиденциальности
                        </A>
                      </label>
                      <label className="check-label">
                        <input required name="content_rules" type="checkbox" />{" "}
                        Я принимаю{" "}
                        <A href="/documents/content">правила сообщества</A>
                      </label>
                      <label className="check-label optional">
                        <input name="marketing" type="checkbox" /> Получать
                        новости и предложения (необязательно)
                      </label>
                    </fieldset>
                  </>
                )}
                {!register && (
                  <div className="form-between">
                    <label className="check-label">
                      <input name="remember" type="checkbox" /> Запомнить меня
                    </label>
                    <A href="/forgot-password">Забыли пароль?</A>
                  </div>
                )}
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <button
                  disabled={submitting}
                  type="submit"
                  className="button button-primary full"
                >
                  {submitting
                    ? "Подождите…"
                    : register
                      ? "Создать аккаунт"
                      : "Войти"}
                </button>
                <div className="or">
                  <span>или</span>
                </div>
                <button
                  className="button button-soft full"
                  type="button"
                  aria-label="Продолжить с VK"
                  onClick={() => {
                    if (apiConfig.mode === "demo") {
                      setError(
                        "Вход через VK станет доступен после подключения Laravel OAuth",
                      );
                      return;
                    }
                    window.location.assign(
                      deelsApi.auth.oauthUrl(
                        "vk",
                        `${window.location.origin}/profile`,
                      ),
                    );
                  }}
                >
                  Продолжить с VK
                </button>
                <p className="auth-switch">
                  {register ? "Уже есть аккаунт?" : "Впервые в Deels?"}{" "}
                  <A href={register ? "/login" : "/register"}>
                    {register ? "Войти" : "Зарегистрироваться"}
                  </A>
                </p>
              </>
            )}
          </form>
        </div>
      </main>
    </PageShell>
  );
}

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const email = String(new FormData(event.currentTarget).get("email") || "");
    try {
      if (apiConfig.mode !== "demo") await deelsApi.auth.forgotPassword(email);
      setSent(true);
    } catch (caught) {
      setError(apiErrorText(caught));
    } finally {
      setLoading(false);
    }
  }
  return (
    <PageShell path="/forgot-password" minimal standalone>
      <main className="auth-page theme-gradient">
        <div className="auth-visual theme-dark-card">
          <Brand />
          <span className="eyebrow">
            <Icon name="spark" /> Вернём доступ
          </span>
          <h1>
            Твои идеи
            <br />
            никуда не
            <br />
            <em>пропали.</em>
          </h1>
          <div className="auth-bubbles">
            <span>✉</span>
            <span>✓</span>
            <span>🔒</span>
          </div>
        </div>
        <div className="auth-form-wrap">
          <form className="auth-card" onSubmit={submit}>
            <div className="mobile-auth-brand">
              <Brand />
            </div>
            <span className="eyebrow">Восстановление доступа</span>
            <h2>{sent ? "Проверьте почту" : "Забыли пароль?"}</h2>
            {sent ? (
              <div className="success-state recovery-success">
                <span>
                  <Icon name="check" />
                </span>
                <p>
                  Мы отправили ссылку для смены пароля. Она будет действовать 30
                  минут.
                </p>
                <A href="/login" className="button button-primary full">
                  Вернуться ко входу
                </A>
                <button
                  type="button"
                  className="button button-soft full"
                  onClick={() => setSent(false)}
                >
                  Отправить повторно
                </button>
              </div>
            ) : (
              <>
                <p>Укажите e‑mail, с которым регистрировались в Deels.</p>
                <label>
                  E‑mail
                  <input
                    required
                    name="email"
                    autoComplete="email"
                    type="email"
                    placeholder="name@example.com"
                  />
                </label>
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <button
                  disabled={loading}
                  className="button button-primary full"
                  type="submit"
                >
                  {loading ? (
                    "Отправляем…"
                  ) : (
                    <>
                      Отправить ссылку <Icon name="arrow" />
                    </>
                  )}
                </button>
                <p className="auth-switch">
                  <A href="/login">
                    <Icon name="back" /> Вернуться ко входу
                  </A>
                </p>
              </>
            )}
          </form>
        </div>
      </main>
    </PageShell>
  );
}

function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") || "");
    const confirmation = String(data.get("password_confirmation") || "");
    if (password !== confirmation) {
      setError("Пароли не совпадают");
      return;
    }
    const params = new URLSearchParams(window.location.search);
    setLoading(true);
    setError("");
    try {
      if (apiConfig.mode !== "demo")
        await deelsApi.auth.resetPassword({
          email: String(data.get("email") || params.get("email") || ""),
          token: String(params.get("token") || ""),
          password,
          passwordConfirmation: confirmation,
        });
      setDone(true);
    } catch (caught) {
      setError(apiErrorText(caught));
    } finally {
      setLoading(false);
    }
  }
  return (
    <PageShell path="/reset-password" minimal standalone>
      <main className="auth-page theme-gradient">
        <div className="auth-visual theme-dark-card">
          <Brand />
          <span className="eyebrow">
            <Icon name="spark" /> Защищённый доступ
          </span>
          <h1>
            Новый пароль.
            <br />
            Новые идеи.
            <br />
            <em>Снова в Deels.</em>
          </h1>
        </div>
        <div className="auth-form-wrap">
          {done ? (
            <div className="auth-card success-state recovery-success">
              <span>
                <Icon name="check" />
              </span>
              <h2>Пароль изменён</h2>
              <p>Теперь можно войти с новым паролем.</p>
              <A href="/login" className="button button-primary full">
                Войти
              </A>
            </div>
          ) : (
            <form className="auth-card" onSubmit={submit}>
              <span className="eyebrow">Восстановление доступа</span>
              <h2>Создайте новый пароль</h2>
              <label>
                E‑mail
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                />
              </label>
              <label>
                Новый пароль
                <input
                  required
                  minLength={8}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                />
              </label>
              <label>
                Повторите пароль
                <input
                  required
                  minLength={8}
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                />
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button
                disabled={loading}
                type="submit"
                className="button button-primary full"
              >
                {loading ? "Сохраняем…" : "Изменить пароль"}
              </button>
            </form>
          )}
        </div>
      </main>
    </PageShell>
  );
}

function VerifyEmailPage({ token }: { token: string }) {
  const [state, setState] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    const verify = async () => {
      try {
        if (apiConfig.mode !== "demo") await deelsApi.auth.verifyEmail(token);
        if (active) setState("success");
      } catch (error) {
        if (active) {
          setMessage(apiErrorText(error));
          setState("error");
        }
      }
    };
    void verify();
    return () => {
      active = false;
    };
  }, [token]);
  return (
    <PageShell path="/verify-email" minimal standalone>
      <main className="auth-page theme-gradient">
        <div className="auth-visual theme-dark-card">
          <Brand />
          <span className="eyebrow">
            <Icon name="spark" /> Подтверждение аккаунта
          </span>
          <h1>
            Один шаг
            <br />
            до полного
            <br />
            <em>доступа.</em>
          </h1>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-card success-state recovery-success">
            <span>
              <Icon name={state === "error" ? "close" : "check"} />
            </span>
            <h2>
              {state === "loading"
                ? "Проверяем ссылку…"
                : state === "success"
                  ? "E‑mail подтверждён"
                  : "Не удалось подтвердить e‑mail"}
            </h2>
            <p>
              {state === "loading"
                ? "Это займёт несколько секунд."
                : state === "success"
                  ? "Аккаунт активирован. Можно создавать и участвовать."
                  : message}
            </p>
            {state === "success" ? (
              <A href="/profile" className="button button-primary full">
                Перейти в профиль
              </A>
            ) : state === "error" ? (
              <button
                type="button"
                className="button button-soft full"
                onClick={async () => {
                  if (apiConfig.mode !== "demo")
                    await deelsApi.auth.resendVerification();
                  setMessage("Новое письмо отправлено");
                }}
              >
                Отправить новую ссылку
              </button>
            ) : null}
          </div>
        </div>
      </main>
    </PageShell>
  );
}

function DashboardShell({
  path,
  title,
  subtitle,
  children,
}: {
  path: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const items = [
    ["user", "Профиль", "/profile"],
    ["wallet", "Кошелёк", "/wallet"],
    ["message", "Сообщения", "/messages"],
    ["bell", "Уведомления", "/notifications"],
    ["settings", "Настройки", "/settings"],
  ];
  const guard = useAuthGuard();
  async function logout() {
    try {
      if (apiConfig.mode !== "demo") await deelsApi.auth.logout();
    } finally {
      window.location.assign("/login");
    }
  }
  return (
    <PageShell path={path} minimal>
      <main className="dashboard-page">
        <div className="container dashboard-grid">
          <aside className="dashboard-sidebar">
            <div className="sidebar-user">
              <span className="avatar">СС</span>
              <div>
                <strong>Личный кабинет</strong>
                <span>Защищённый раздел</span>
              </div>
            </div>
            <nav>
              {items.map(([icon, label, href]) => (
                <A
                  className={path === href ? "active" : ""}
                  href={href}
                  key={href}
                >
                  <Icon name={icon} />
                  {label}
                  {label === "Сообщения" && <b>3</b>}
                </A>
              ))}
            </nav>
            <A href="/create" className="button button-primary">
              <Icon name="plus" /> Создать
            </A>
            <button type="button" onClick={logout} className="sidebar-logout">
              <Icon name="back" /> Выйти
            </button>
          </aside>
          <section className="dashboard-content">
            <div className="dashboard-title">
              <div>
                <span className="eyebrow">Личный кабинет</span>
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
              </div>
            </div>
            {guard.checking ? (
              <div className="content-card auth-check" role="status">
                Проверяем безопасный вход…
              </div>
            ) : guard.error && apiConfig.mode !== "demo" ? (
              <div className="content-card auth-check">
                <p className="form-error" role="alert">
                  {guard.error}
                </p>
                <button
                  type="button"
                  className="button button-soft button-small"
                  onClick={() => window.location.reload()}
                >
                  Повторить
                </button>
              </div>
            ) : (
              children
            )}
          </section>
        </div>
      </main>
    </PageShell>
  );
}

function ProfilePage() {
  const [tab, setTab] = useState("Мои видео");
  const {
    data: challenges,
    loading,
    error,
    source,
  } = useApiResource(
    `profile-content:${tab}`,
    async () =>
      (
        await deelsApi.challenges.list({
          mine: tab !== "Сохранённое",
          saved: tab === "Сохранённое" || undefined,
          type: tab,
          limit: 12,
        })
      ).items,
    demoContent.challenges,
  );
  const { data: profile } = useApiResource(
    "profile",
    () => deelsApi.profile.me(),
    demoUser,
  );
  return (
    <DashboardShell path="/profile" title="Мой профиль">
      <section className="profile-hero theme-dark-card">
        <div className="profile-main">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- Laravel controls the avatar CDN at runtime.
            <img
              className="avatar avatar-large"
              src={profile.avatarUrl}
              alt={`Аватар ${profile.name}`}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="avatar avatar-large">{profile.initials}</span>
          )}
          <div>
            <h2>
              {profile.name} {profile.verified !== false && <span>✓</span>}
            </h2>
            <p>
              @{profile.username}
              {profile.city ? ` • ${profile.city}` : ""}
            </p>
            <p>{profile.bio || "Расскажите о себе в настройках профиля."}</p>
          </div>
          <A href="/settings" className="button button-white button-small">
            Редактировать
          </A>
        </div>
        <div className="profile-stats">
          <div>
            <strong>{profile.posts || challenges.length}</strong>
            <span>публикаций</span>
          </div>
          <div>
            <strong>{profile.followers || "8,4K"}</strong>
            <span>подписчиков</span>
          </div>
          <div>
            <strong>{profile.votes || "0"}</strong>
            <span>голосов</span>
          </div>
          <div>
            <strong>{profile.wins || "0"}</strong>
            <span>победы</span>
          </div>
        </div>
      </section>
      <Filters
        items={["Мои видео", "Челленджи", "Сохранённое", "Копилки"]}
        value={tab}
        onChange={setTab}
      />
      <StatusLine loading={loading} error={error} source={source} />
      <div className="profile-video-grid">
        {challenges.map((item, index) => (
          <A
            href={`/challenges/${item.id}`}
            key={item.id}
            className={`profile-video poster-${item.tone}`}
          >
            <span>{item.emoji}</span>
            <div>
              <strong>
                {["84K", "62K", "41K", "28K", "21K", "18K"][index] || "—"}
              </strong>
              <small>просмотров</small>
            </div>
          </A>
        ))}
      </div>
      {!challenges.length && (
        <div className="empty-results">
          <h2>Здесь пока пусто</h2>
          <p>Создайте публикацию или сохраните понравившийся челлендж.</p>
        </div>
      )}
    </DashboardShell>
  );
}

function PublicProfilePage({ id }: { id: string }) {
  const fallback =
    demoUser.username === id
      ? demoUser
      : {
          ...demoUser,
          id,
          username: id,
          name: id.replace(/[._-]+/g, " "),
          initials: id.slice(0, 2).toUpperCase(),
        };
  const profile = useApiResource(
    `public-profile:${id}`,
    () => deelsApi.users.detail(id),
    fallback,
  );
  const content = useApiResource(
    `public-content:${id}`,
    async () => (await deelsApi.users.content(id, { limit: 12 })).items,
    demoContent.challenges,
  );
  const [following, setFollowing] = useState(false);
  return (
    <PageShell path={`/users/${id}`}>
      <main className="dashboard-page public-profile-page">
        <div className="container">
          <StatusLine
            loading={profile.loading || content.loading}
            error={profile.error || content.error}
            source={profile.source}
          />
          <section className="profile-hero theme-dark-card">
            <div className="profile-main">
              {profile.data.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Laravel controls the avatar CDN at runtime.
                <img
                  className="avatar avatar-large"
                  src={profile.data.avatarUrl}
                  alt={`Аватар ${profile.data.name}`}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="avatar avatar-large">
                  {profile.data.initials}
                </span>
              )}
              <div>
                <h1>
                  {profile.data.name} {profile.data.verified && <span>✓</span>}
                </h1>
                <p>
                  @{profile.data.username}
                  {profile.data.city ? ` • ${profile.data.city}` : ""}
                </p>
                <p>{profile.data.bio || "Автор Deels"}</p>
              </div>
              <button
                type="button"
                className="button button-white button-small"
                aria-pressed={following}
                onClick={async () => {
                  const next = !following;
                  setFollowing(next);
                  try {
                    if (apiConfig.mode !== "demo")
                      await deelsApi.social.follow(profile.data.id);
                  } catch {
                    setFollowing(!next);
                  }
                }}
              >
                {following ? "Вы подписаны" : "Подписаться"}
              </button>
            </div>
            <div className="profile-stats">
              <div>
                <strong>{content.data.length}</strong>
                <span>публикаций</span>
              </div>
              <div>
                <strong>{profile.data.followers || "0"}</strong>
                <span>подписчиков</span>
              </div>
            </div>
          </section>
          <h2 className="public-profile-heading">Публикации</h2>
          <div className="profile-video-grid">
            {content.data.map((item) => (
              <A
                href={`/challenges/${item.id}`}
                key={item.id}
                className={`profile-video poster-${item.tone}`}
              >
                <span>{item.emoji}</span>
                <div>
                  <strong>{item.participants}</strong>
                  <small>участников</small>
                </div>
              </A>
            ))}
          </div>
        </div>
      </main>
    </PageShell>
  );
}

function WalletPage() {
  const resource = useApiResource(
    "wallet",
    () => deelsApi.wallet.summary(),
    demoWallet,
  );
  const wallet = resource.data;
  const [action, setAction] = useState<"deposit" | "withdraw" | null>(null);
  const [amount, setAmount] = useState("1000");
  const [period, setPeriod] = useState("all");
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState("");
  async function submitAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!action) return;
    const value = Number(amount.replace(/\D/g, ""));
    if (!Number.isFinite(value) || value < 100) {
      setFeedback("Минимальная сумма операции — 100 ₽");
      return;
    }
    setProcessing(true);
    setFeedback("");
    try {
      if (apiConfig.mode !== "demo") {
        const result =
          action === "deposit"
            ? await deelsApi.wallet.deposit(value, window.location.href)
            : await deelsApi.wallet.withdraw(value);
        const redirect =
          typeof result.payment_url === "string"
            ? result.payment_url
            : typeof result.redirect_url === "string"
              ? result.redirect_url
              : "";
        if (redirect) {
          window.location.assign(redirect);
          return;
        }
      }
      setFeedback(
        action === "deposit" ? "Пополнение создано" : "Заявка на вывод принята",
      );
      setAction(null);
      resource.refresh();
    } catch (error) {
      setFeedback(apiErrorText(error));
    } finally {
      setProcessing(false);
    }
  }
  const transactions =
    period === "all"
      ? wallet.transactions
      : wallet.transactions.filter((row) =>
          /сегодня|август|июль/i.test(row.occurredAt),
        );
  return (
    <DashboardShell
      path="/wallet"
      title="Кошелёк"
      subtitle="Баланс, призы и история операций"
    >
      <StatusLine
        loading={resource.loading}
        error={resource.error}
        source={resource.source}
      />
      <section className="balance-grid">
        <article className="balance-card theme-dark-card">
          <span>Доступно</span>
          <strong>{wallet.available}</strong>
          <div>
            <button
              type="button"
              onClick={() => {
                setAction("withdraw");
                setFeedback("");
              }}
              className="button button-white button-small"
            >
              Вывести
            </button>
            <button
              type="button"
              onClick={() => {
                setAction("deposit");
                setFeedback("");
              }}
              className="button button-glass button-small"
            >
              Пополнить
            </button>
          </div>
        </article>
        <article className="balance-card">
          <span>Ожидает начисления</span>
          <strong>{wallet.pending}</strong>
          <p>Призы и переводы на проверке</p>
          <small>срок зависит от операции</small>
        </article>
      </section>
      {action && (
        <form className="content-card wallet-action" onSubmit={submitAction}>
          <div>
            <span className="eyebrow">
              {action === "deposit" ? "Пополнение" : "Вывод средств"}
            </span>
            <h2>
              {action === "deposit"
                ? "Пополнить баланс"
                : "Вывести на сохранённый способ"}
            </h2>
          </div>
          <label>
            Сумма
            <div className="suffix-input">
              <input
                inputMode="numeric"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value.replace(/\D/g, ""))
                }
              />
              <span>₽</span>
            </div>
          </label>
          <div className="wallet-action-buttons">
            <button
              type="button"
              className="button button-soft"
              onClick={() => setAction(null)}
            >
              Отмена
            </button>
            <button
              disabled={processing}
              className="button button-primary"
              type="submit"
            >
              {processing ? "Обрабатываем…" : "Продолжить"}
            </button>
          </div>
        </form>
      )}
      {feedback && (
        <p className="form-error" role="status">
          {feedback}
        </p>
      )}
      <section className="content-card transactions">
        <div className="card-title">
          <h2>История операций</h2>
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            aria-label="Период операций"
          >
            <option value="all">За всё время</option>
            <option value="month">Этот месяц</option>
          </select>
        </div>
        {transactions.map((row) => (
          <div className="transaction" key={row.id}>
            <span>{row.direction === "credit" ? "✦" : "↗"}</span>
            <div>
              <strong>{row.title}</strong>
              <small>{row.occurredAt}</small>
            </div>
            <b className={row.direction === "credit" ? "positive" : ""}>
              {row.amount}
            </b>
          </div>
        ))}
      </section>
    </DashboardShell>
  );
}

function MessagesPage() {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [sendError, setSendError] = useState("");
  const dialogs = useApiResource(
    "dialogs",
    async () => (await deelsApi.messages.dialogs()).items,
    demoDialogs,
  );
  const chats = dialogs.data.filter((chat) =>
    `${chat.title} ${chat.preview}`.toLowerCase().includes(query.toLowerCase()),
  );
  const selected =
    chats[Math.min(active, Math.max(0, chats.length - 1))] || demoDialogs[0];
  const thread = useApiResource(
    `thread:${selected.id}`,
    async () => (await deelsApi.messages.thread(selected.id)).items,
    demoMessages,
  );
  async function sendMessage() {
    if (!message.trim()) return;
    setSendError("");
    try {
      if (apiConfig.mode !== "demo")
        await deelsApi.messages.send(selected.id, message.trim());
      setMessage("");
      thread.refresh();
    } catch (caught) {
      setSendError(apiErrorText(caught));
    }
  }
  return (
    <DashboardShell path="/messages" title="Сообщения">
      <StatusLine
        loading={dialogs.loading}
        error={dialogs.error}
        source={dialogs.source}
      />
      <section className="messenger">
        <div className="chat-list">
          <div className="chat-search">
            <Icon name="search" />
            <input
              aria-label="Поиск диалогов"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              placeholder="Поиск диалогов"
            />
          </div>
          {chats.map((chat, index) => (
            <button
              type="button"
              className={active === index ? "active" : ""}
              key={chat.id}
              onClick={() => setActive(index)}
            >
              <span className="avatar avatar-small">{chat.avatar}</span>
              <div>
                <strong>{chat.title}</strong>
                <p>{chat.preview}</p>
              </div>
              <small>
                {chat.time}
                {chat.unread ? ` • ${chat.unread}` : ""}
              </small>
            </button>
          ))}
          {!chats.length && <p className="chat-empty">Диалоги не найдены</p>}
        </div>
        <div className="chat-window">
          <div className="chat-head">
            <span className="avatar avatar-small">{selected.avatar}</span>
            <div>
              <strong>{selected.title}</strong>
              <span>защищённый чат</span>
            </div>
            <Icon name="more" />
          </div>
          <div className="chat-body">
            <span className="date-pill">Сегодня</span>
            {thread.data.map((item) => (
              <p key={item.id} className={`message ${item.direction}`}>
                {item.text}
                <small>{item.time}</small>
              </p>
            ))}
            <StatusLine
              loading={thread.loading}
              error={thread.error}
              source={thread.source}
            />
            {sendError && (
              <p className="form-error" role="alert">
                {sendError}
              </p>
            )}
          </div>
          <div className="message-input">
            <label className="sr-only" htmlFor="message-text">
              Сообщение
            </label>
            <input
              id="message-text"
              value={message}
              maxLength={2000}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Написать сообщение"
            />
            <button
              type="button"
              disabled={!message.trim()}
              onClick={sendMessage}
              className="send-button"
              aria-label="Отправить сообщение"
            >
              <Icon name="arrow" />
            </button>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

function NotificationsPage() {
  const [filter, setFilter] = useState("Все");
  const [readIds, setReadIds] = useState<string[]>([]);
  const category =
    filter === "Активность"
      ? "activity"
      : filter === "Челленджи"
        ? "challenge"
        : filter === "Система"
          ? "system"
          : undefined;
  const resource = useApiResource(
    `notifications:${filter}`,
    async () => (await deelsApi.notifications.list({ category })).items,
    demoNotifications,
  );
  const notifications = resource.data.filter(
    (item) => !category || item.category === category,
  );
  async function markRead(id: string) {
    if (readIds.includes(id)) return;
    setReadIds((current) => [...current, id]);
    if (apiConfig.mode !== "demo") await deelsApi.notifications.read(id);
  }
  async function markAll() {
    setReadIds(resource.data.map((item) => item.id));
    if (apiConfig.mode !== "demo") await deelsApi.notifications.readAll();
  }
  return (
    <DashboardShell path="/notifications" title="Уведомления">
      <div className="notification-toolbar">
        <Filters
          items={["Все", "Активность", "Челленджи", "Система"]}
          value={filter}
          onChange={setFilter}
        />
        <button
          type="button"
          onClick={markAll}
          className="button button-soft button-small"
        >
          Прочитать все
        </button>
      </div>
      <StatusLine
        loading={resource.loading}
        error={resource.error}
        source={resource.source}
      />
      <section className="content-card notification-list">
        {notifications.map((item) => {
          const unread = item.unread && !readIds.includes(item.id);
          return (
            <article
              role="button"
              tabIndex={0}
              onClick={() => markRead(item.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ")
                  void markRead(item.id);
              }}
              className={unread ? "unread" : ""}
              key={item.id}
            >
              <span className="notice-icon">{item.icon}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
              <small>{item.time}</small>
            </article>
          );
        })}
        {!notifications.length && (
          <div className="empty-results">
            <h2>Нет уведомлений</h2>
            <p>Новые события появятся здесь.</p>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}

function SearchPage() {
  const demoUsers: UserView[] = [
    {
      id: "alina",
      name: "Алина Moves",
      username: "alina.moves",
      initials: "АМ",
      followers: "24,8K",
    },
    {
      id: "dance-club",
      name: "Dance Club",
      username: "dance.club",
      initials: "DC",
      followers: "18,2K",
    },
    {
      id: "mila",
      name: "Мила Sun",
      username: "mila.sun",
      initials: "МС",
      followers: "12,4K",
    },
  ];
  const [query, setQuery] = useState("танцы");
  const [submitted, setSubmitted] = useState("танцы");
  const [tab, setTab] = useState("Всё");
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const value = new URLSearchParams(window.location.search).get("q");
      if (value) {
        setQuery(value);
        setSubmitted(value);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const fallback: SearchResultView = {
    challenges: demoContent.challenges
      .filter((item) =>
        `${item.title} ${item.tag}`
          .toLowerCase()
          .includes(submitted.toLowerCase()),
      )
      .slice(0, 4),
    stories: demoContent.stories.slice(0, 2),
    campaigns: demoContent.campaigns.slice(0, 2),
    users: demoUsers,
    raw: {},
  };
  const resource = useApiResource(
    `search:${submitted}`,
    () => deelsApi.search.all(submitted),
    fallback,
  );
  const results = resource.data;
  const total =
    results.challenges.length +
    results.stories.length +
    results.campaigns.length +
    results.users.length;
  return (
    <PageShell path="/search">
      <main>
        <section className="search-page">
          <div className="container">
            <span className="eyebrow">
              <Icon name="search" /> Поиск по Deels
            </span>
            <form
              className="big-search"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                const value = query.trim();
                setSubmitted(value);
                window.history.replaceState(
                  {},
                  "",
                  value ? `/search?q=${encodeURIComponent(value)}` : "/search",
                );
              }}
            >
              <label className="sr-only" htmlFor="global-search">
                Поиск
              </label>
              <input
                id="global-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Челлендж, автор, история или копилка"
              />
              <button
                disabled={resource.loading || !query.trim()}
                type="submit"
              >
                <Icon name="search" /> {resource.loading ? "Ищем…" : "Найти"}
              </button>
            </form>
            <Filters
              items={["Всё", "Челленджи", "Авторы", "Истории", "Копилки"]}
              value={tab}
              onChange={setTab}
              label="Тип результата"
            />
            <StatusLine
              loading={resource.loading}
              error={resource.error}
              source={resource.source}
            />
            <div className="search-summary">
              <h2>Результаты по запросу «{submitted || "…"}»</h2>
              <span>{total} результатов</span>
            </div>
            {(tab === "Всё" || tab === "Челленджи") &&
              results.challenges.length > 0 && (
                <section className="search-group">
                  <h3>Челленджи</h3>
                  <div className="catalog-grid compact-grid">
                    {results.challenges.map((item) => (
                      <ChallengeCard key={item.id} item={item} compact />
                    ))}
                  </div>
                </section>
              )}
            {(tab === "Всё" || tab === "Авторы") &&
              results.users.length > 0 && (
                <section className="content-card people-results search-people">
                  <h3>Авторы</h3>
                  {results.users.map((user) => (
                    <A href={`/users/${user.username}`} key={user.id}>
                      <span className="avatar avatar-small">
                        {user.initials}
                      </span>
                      <div>
                        <strong>{user.name}</strong>
                        <small>
                          @{user.username} • {user.followers || "0"} подписчиков
                        </small>
                      </div>
                      <span className="follow-button">+</span>
                    </A>
                  ))}
                </section>
              )}
            {(tab === "Всё" || tab === "Истории") &&
              results.stories.length > 0 && (
                <section className="search-group">
                  <h3>Истории</h3>
                  <div className="stories-catalog">
                    {results.stories.map((item) => (
                      <StoryCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              )}
            {(tab === "Всё" || tab === "Копилки") &&
              results.campaigns.length > 0 && (
                <section className="search-group">
                  <h3>Копилки</h3>
                  <div className="campaign-grid">
                    {results.campaigns.map((item) => (
                      <CampaignCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              )}
            {!total && (
              <div className="empty-results">
                <h2>Ничего не найдено</h2>
                <p>Попробуйте другой запрос или проверьте написание.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function SettingsPage() {
  const tabs = ["Аккаунт", "Приватность", "Уведомления", "Безопасность"];
  const [tab, setTab] = useState("Аккаунт");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const profileResource = useApiResource(
    "settings-profile",
    () => deelsApi.profile.me(),
    demoUser,
  );
  const profile = profileResource.data;
  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback("");
    try {
      if (apiConfig.mode !== "demo")
        await deelsApi.profile.update(
          Object.fromEntries(new FormData(event.currentTarget).entries()),
        );
      setFeedback("Изменения сохранены");
      profileResource.refresh();
    } catch (error) {
      setFeedback(apiErrorText(error));
    } finally {
      setLoading(false);
    }
  }
  async function submitPreferences(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback("");
    const form = new FormData(event.currentTarget);
    const fields =
      tab === "Приватность"
        ? [
            "public_profile",
            "direct_messages",
            "show_city",
            "personalized_feed",
          ]
        : [
            "notify_activity",
            "notify_challenges",
            "notify_payments",
            "notify_marketing",
          ];
    const payload = Object.fromEntries(
      fields.map((key) => [key, form.get(key) === "on"]),
    );
    try {
      if (apiConfig.mode !== "demo")
        await deelsApi.settings.updatePreferences(payload);
      setFeedback("Настройки сохранены");
    } catch (error) {
      setFeedback(apiErrorText(error));
    } finally {
      setLoading(false);
    }
  }
  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("password_confirmation") || "");
    if (password !== confirmation) {
      setFeedback("Новые пароли не совпадают");
      return;
    }
    setLoading(true);
    setFeedback("");
    try {
      if (apiConfig.mode !== "demo")
        await deelsApi.settings.changePassword(
          String(form.get("current_password") || ""),
          password,
          confirmation,
        );
      event.currentTarget.reset();
      setFeedback("Пароль изменён");
    } catch (error) {
      setFeedback(apiErrorText(error));
    } finally {
      setLoading(false);
    }
  }
  return (
    <DashboardShell path="/settings" title="Настройки">
      <StatusLine
        loading={profileResource.loading}
        error={profileResource.error}
        source={profileResource.source}
      />
      <div className="settings-layout">
        <nav aria-label="Разделы настроек">
          {tabs.map((item) => (
            <button
              type="button"
              key={item}
              className={tab === item ? "active" : ""}
              onClick={() => {
                setTab(item);
                setFeedback("");
              }}
            >
              {item}
            </button>
          ))}
        </nav>
        {tab === "Аккаунт" && (
          <form className="content-card settings-form" onSubmit={submitProfile}>
            <div className="settings-avatar">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Laravel controls the avatar CDN at runtime.
                <img
                  className="avatar avatar-large"
                  src={profile.avatarUrl}
                  alt={`Аватар ${profile.name}`}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="avatar avatar-large">{profile.initials}</span>
              )}
              <label className="button button-soft button-small">
                Изменить фото
                <input
                  className="file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setLoading(true);
                    try {
                      if (apiConfig.mode !== "demo")
                        await deelsApi.profile.uploadAvatar(file);
                      setFeedback("Фото обновлено");
                      profileResource.refresh();
                    } catch (error) {
                      setFeedback(apiErrorText(error));
                    } finally {
                      setLoading(false);
                    }
                  }}
                />
              </label>
            </div>
            <div className="form-two">
              <label>
                Имя
                <input
                  required
                  name="first_name"
                  defaultValue={profile.name.split(" ")[0]}
                />
              </label>
              <label>
                Фамилия
                <input
                  name="last_name"
                  defaultValue={profile.name.split(" ").slice(1).join(" ")}
                />
              </label>
            </div>
            <label>
              Имя пользователя
              <div className="prefix-input">
                <span>@</span>
                <input
                  required
                  name="username"
                  defaultValue={profile.username}
                  pattern="[a-zA-Z0-9._-]{3,30}"
                />
              </div>
            </label>
            <label>
              О себе
              <textarea
                name="bio"
                maxLength={500}
                rows={4}
                defaultValue={profile.bio}
              />
            </label>
            <label>
              Город
              <input name="city" defaultValue={profile.city} />
            </label>
            <button
              disabled={loading}
              className="button button-primary"
              type="submit"
            >
              {loading ? "Сохраняем…" : "Сохранить изменения"}
            </button>
          </form>
        )}
        {tab === "Приватность" && (
          <form
            className="content-card settings-form preference-form"
            onSubmit={submitPreferences}
          >
            <h2>Приватность</h2>
            <p>Управляйте видимостью профиля и взаимодействиями.</p>
            <label className="switch-row">
              <span>
                <strong>Публичный профиль</strong>
                <small>Профиль и публикации видны в поиске</small>
              </span>
              <input type="checkbox" name="public_profile" defaultChecked />
            </label>
            <label className="switch-row">
              <span>
                <strong>Личные сообщения</strong>
                <small>Разрешить сообщения от пользователей Deels</small>
              </span>
              <input type="checkbox" name="direct_messages" defaultChecked />
            </label>
            <label className="switch-row">
              <span>
                <strong>Показывать город</strong>
                <small>Отображать город в публичном профиле</small>
              </span>
              <input type="checkbox" name="show_city" defaultChecked />
            </label>
            <label className="switch-row">
              <span>
                <strong>Персональные рекомендации</strong>
                <small>Использовать активность для настройки ленты</small>
              </span>
              <input type="checkbox" name="personalized_feed" defaultChecked />
            </label>
            <button
              disabled={loading}
              className="button button-primary"
              type="submit"
            >
              Сохранить
            </button>
          </form>
        )}
        {tab === "Уведомления" && (
          <form
            className="content-card settings-form preference-form"
            onSubmit={submitPreferences}
          >
            <h2>Уведомления</h2>
            <p>Выберите только полезные события.</p>
            <label className="switch-row">
              <span>
                <strong>Голоса и комментарии</strong>
                <small>Активность под вашими публикациями</small>
              </span>
              <input type="checkbox" name="notify_activity" defaultChecked />
            </label>
            <label className="switch-row">
              <span>
                <strong>Челленджи</strong>
                <small>Финалы, результаты и изменения условий</small>
              </span>
              <input type="checkbox" name="notify_challenges" defaultChecked />
            </label>
            <label className="switch-row">
              <span>
                <strong>Платежи</strong>
                <small>Пополнения, призы и вывод средств</small>
              </span>
              <input type="checkbox" name="notify_payments" defaultChecked />
            </label>
            <label className="switch-row">
              <span>
                <strong>Новости Deels</strong>
                <small>Редкие продуктовые обновления</small>
              </span>
              <input type="checkbox" name="notify_marketing" />
            </label>
            <button
              disabled={loading}
              className="button button-primary"
              type="submit"
            >
              Сохранить
            </button>
          </form>
        )}
        {tab === "Безопасность" && (
          <div className="settings-security">
            <form
              className="content-card settings-form"
              onSubmit={submitPassword}
            >
              <h2>Изменить пароль</h2>
              <label>
                Текущий пароль
                <input
                  required
                  name="current_password"
                  type="password"
                  autoComplete="current-password"
                />
              </label>
              <label>
                Новый пароль
                <input
                  required
                  minLength={8}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                />
              </label>
              <label>
                Повторите новый пароль
                <input
                  required
                  minLength={8}
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                />
              </label>
              <button
                disabled={loading}
                className="button button-primary"
                type="submit"
              >
                Изменить пароль
              </button>
            </form>
            <section className="content-card session-card">
              <h2>Активные сессии</h2>
              <p>
                Закройте входы на других устройствах, если заметили неизвестную
                активность.
              </p>
              <button
                type="button"
                className="button button-soft"
                onClick={async () => {
                  setLoading(true);
                  try {
                    if (apiConfig.mode !== "demo")
                      await deelsApi.settings.closeOtherSessions();
                    setFeedback("Остальные сессии закрыты");
                  } catch (error) {
                    setFeedback(apiErrorText(error));
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Выйти на других устройствах
              </button>
            </section>
          </div>
        )}
      </div>
      {feedback && (
        <p className="form-error" role="status">
          {feedback}
        </p>
      )}
    </DashboardShell>
  );
}

function ChallengeResponsePage({ id }: { id: string }) {
  const guard = useAuthGuard();
  const fallback =
    demoContent.challenges.find((item) => item.id === id) ||
    demoContent.challenges[0];
  const resource = useApiResource(
    `response-challenge:${id}`,
    () => deelsApi.challenges.detail(id),
    fallback,
  );
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("Добавьте видеоответ");
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      setError("Видео должно быть не больше 200 МБ");
      return;
    }
    setPublishing(true);
    setError("");
    try {
      if (apiConfig.mode !== "demo")
        await deelsApi.challenges.join(id, file, caption);
      setDone(true);
    } catch (caught) {
      setError(apiErrorText(caught));
    } finally {
      setPublishing(false);
    }
  }
  if (guard.checking)
    return (
      <PageShell path={`/challenges/${id}/respond`} minimal standalone>
        <main className="create-page">
          <div className="publish-success">Проверяем безопасный вход…</div>
        </main>
      </PageShell>
    );
  if (guard.error && apiConfig.mode !== "demo")
    return (
      <PageShell path={`/challenges/${id}/respond`} minimal standalone>
        <main className="create-page">
          <div className="publish-success">
            <h1>Не удалось проверить доступ</h1>
            <p role="alert">{guard.error}</p>
            <A
              href={`/login?next=${encodeURIComponent(`/challenges/${id}/respond`)}`}
              className="button button-primary"
            >
              Войти снова
            </A>
          </div>
        </main>
      </PageShell>
    );
  return (
    <PageShell path={`/challenges/${id}/respond`} minimal standalone>
      <main className="create-page">
        <div className="container create-head">
          <A href={`/challenges/${id}`} className="back-link">
            <Icon name="back" /> Вернуться к челленджу
          </A>
          <Brand />
        </div>
        {done ? (
          <div className="publish-success">
            <span>
              <Icon name="check" />
            </span>
            <h1>Видеоответ отправлен</h1>
            <p>
              После обработки и модерации он появится среди ответов участников.
            </p>
            <A href={`/challenges/${id}`} className="button button-primary">
              Открыть челлендж
            </A>
          </div>
        ) : (
          <div className="container response-layout">
            <form className="create-form content-card" onSubmit={submit}>
              <span className="eyebrow">Ответ на челлендж</span>
              <h1>{resource.data.title}</h1>
              <StatusLine
                loading={resource.loading}
                error={resource.error || guard.error}
                source={resource.source}
              />
              <label className="upload-zone">
                <input
                  required
                  className="file-input"
                  type="file"
                  accept="video/mp4,video/quicktime"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
                <span>▶</span>
                <strong>
                  {file ? file.name : "Выбрать вертикальное видео"}
                </strong>
                <p>MP4 или MOV • до 200 МБ • рекомендуем 9:16</p>
                <span className="button button-soft button-small">
                  Добавить видео
                </span>
              </label>
              <label>
                Подпись
                <textarea
                  rows={4}
                  maxLength={500}
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  placeholder="Расскажите о своём ответе"
                />
              </label>
              <label className="check-label">
                <input required type="checkbox" /> Подтверждаю права на видео,
                музыку и изображённых людей
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button
                disabled={publishing}
                className="button button-primary"
                type="submit"
              >
                {publishing ? "Загружаем…" : "Опубликовать ответ"}
              </button>
            </form>
            <aside className="response-tips content-card">
              <h2>Перед публикацией</h2>
              <ul>
                <li>Снимайте вертикально и при хорошем освещении.</li>
                <li>Не используйте чужую музыку без разрешения.</li>
                <li>Не добавляйте опасные действия и личные данные.</li>
                <li>
                  Один участник — один ответ, если правила не говорят иначе.
                </li>
              </ul>
              <A href="/documents/content" className="text-link">
                Правила контента <Icon name="arrow" />
              </A>
            </aside>
          </div>
        )}
      </main>
    </PageShell>
  );
}

function CreateHub() {
  return (
    <PageShell path="/create">
      <main>
        <CatalogHero
          eyebrow="Начни с идеи"
          title="Что создаём?"
          text="Выбери формат — дальше Deels проведёт по понятным шагам и сразу покажет результат."
        />
        <section className="section">
          <div className="container create-choice-grid">
            <A
              href="/create/challenge"
              className="create-choice theme-dark-card"
            >
              <span>🏆</span>
              <small>Самый популярный формат</small>
              <h2>Челлендж</h2>
              <p>Задание, ответы участников, голосование и призовой фонд.</p>
              <b>
                Создать челлендж <Icon name="arrow" />
              </b>
            </A>
            <A href="/create/story" className="create-choice poster-pink">
              <span>✨</span>
              <small>Расскажи важное</small>
              <h2>История</h2>
              <p>Вертикальное видео с текстом, темой и обсуждением.</p>
              <b>
                Создать историю <Icon name="arrow" />
              </b>
            </A>
            <A href="/create/campaign" className="create-choice poster-blue">
              <span>💜</span>
              <small>Собери поддержку</small>
              <h2>Копилка</h2>
              <p>Цель, документы, новости и прозрачный прогресс сбора.</p>
              <b>
                Создать копилку <Icon name="arrow" />
              </b>
            </A>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function CreatePage({
  type,
  editingId,
}: {
  type: "challenge" | "story" | "campaign";
  editingId?: string;
}) {
  const editing = Boolean(editingId);
  const guard = useAuthGuard();
  const labels =
    type === "challenge"
      ? {
          eyebrow: "Новый челлендж",
          title: "Повтори мой летний движ",
          desc: "Покажи свой фирменный танец за 30 секунд.",
          emoji: "🕺",
          button: "Опубликовать челлендж",
        }
      : type === "story"
        ? {
            eyebrow: "Новая история",
            title: "Мой поворотный момент",
            desc: "Расскажи, что изменило твою жизнь.",
            emoji: "✨",
            button: "Опубликовать историю",
          }
        : {
            eyebrow: "Новая копилка",
            title: "Важная цель",
            desc: "Объясни, кому и зачем нужна поддержка.",
            emoji: "💜",
            button: "Отправить на проверку",
          };
  const [draft, setDraft] = useState<ContentDraft>({
    title: labels.title,
    description: labels.desc,
    category:
      type === "challenge"
        ? "Танцы"
        : type === "story"
          ? "Вдохновение"
          : "Социальная помощь",
    goal: type === "campaign" ? 2_000_000 : undefined,
    prize: type === "challenge" ? 50_000 : undefined,
    endsAt: type === "challenge" ? "2026-08-20" : undefined,
    rules:
      type === "challenge"
        ? "Одно вертикальное видео до 30 секунд. Используйте оригинальный звук челленджа."
        : undefined,
    documents: [],
  });
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [createdHref, setCreatedHref] = useState(
    type === "campaign"
      ? "/campaigns/help-masha"
      : type === "story"
        ? "/stories/dance-with-me"
        : "/challenges/summer-move",
  );
  const update = <K extends keyof ContentDraft>(
    key: K,
    value: ContentDraft[K],
  ) => setDraft((current) => ({ ...current, [key]: value }));
  async function publish() {
    if (!accepted) {
      setError("Подтвердите правила публикации");
      return;
    }
    setPublishing(true);
    setError("");
    try {
      if (apiConfig.mode !== "demo") {
        const created = await deelsApi.createContent(type, draft, editingId);
        setCreatedHref(
          type === "campaign"
            ? `/campaigns/${created.id}`
            : type === "story"
              ? `/stories/${created.id}`
              : `/challenges/${created.id}`,
        );
      }
      window.localStorage.removeItem(`deels-draft-${type}`);
      setDone(true);
    } catch (caught) {
      setError(apiErrorText(caught));
    } finally {
      setPublishing(false);
    }
  }
  function saveDraft() {
    window.localStorage.setItem(
      `deels-draft-${type}`,
      JSON.stringify({ ...draft, media: undefined, documents: [] }),
    );
  }
  useEffect(() => {
    if (editing) return;
    const frame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem(`deels-draft-${type}`);
      if (!saved) return;
      try {
        setDraft((current) => ({ ...current, ...JSON.parse(saved) }));
      } catch {}
    });
    return () => window.cancelAnimationFrame(frame);
  }, [editing, type]);
  if (guard.checking)
    return (
      <PageShell path={`/create/${type}`} minimal standalone>
        <main className="create-page">
          <div className="publish-success" role="status">
            Проверяем безопасный вход…
          </div>
        </main>
      </PageShell>
    );
  if (guard.error && apiConfig.mode !== "demo")
    return (
      <PageShell path={`/create/${type}`} minimal standalone>
        <main className="create-page">
          <div className="publish-success">
            <h1>Не удалось проверить доступ</h1>
            <p role="alert">{guard.error}</p>
            <A
              href={`/login?next=${encodeURIComponent(`/create/${type}`)}`}
              className="button button-primary"
            >
              Войти снова
            </A>
          </div>
        </main>
      </PageShell>
    );
  return (
    <PageShell path={`/create/${type}`} minimal standalone>
      <main className="create-page">
        <div className="container create-head">
          <A href="/create" className="back-link">
            <Icon name="back" /> Назад к форматам
          </A>
          <Brand />
          <button
            type="button"
            onClick={saveDraft}
            className="button button-soft button-small"
          >
            Сохранить черновик
          </button>
        </div>
        {guard.error && (
          <div className="container">
            <p className="form-error" role="alert">
              {guard.error}
            </p>
          </div>
        )}
        {done ? (
          <div className="publish-success">
            <span>
              <Icon name="check" />
            </span>
            <h1>
              {type === "campaign"
                ? "Заявка отправлена"
                : "Готово! Публикация создана"}
            </h1>
            <p>
              {type === "campaign"
                ? "Мы проверим документы и сообщим о результате."
                : "Уже можно делиться ссылкой и приглашать участников."}
            </p>
            <A href={createdHref} className="button button-primary">
              Посмотреть страницу <Icon name="arrow" />
            </A>
          </div>
        ) : (
          <div className="container create-layout">
            <section className="create-form">
              <span className="eyebrow">
                {editing ? "Редактирование" : labels.eyebrow}
              </span>
              <h1>{editing ? "Обновить публикацию" : "Расскажи об идее"}</h1>
              <div className="stepper">
                {[1, 2, 3].map((n) => (
                  <button
                    type="button"
                    key={n}
                    className={step >= n ? "active" : ""}
                    onClick={() => setStep(n)}
                  >
                    <span>{step > n ? "✓" : n}</span>
                    {["Основное", "Медиа и условия", "Проверка"][n - 1]}
                  </button>
                ))}
              </div>
              {step === 1 && (
                <div className="form-stack">
                  <label>
                    Название
                    <input
                      required
                      value={draft.title}
                      maxLength={60}
                      onChange={(e) => update("title", e.target.value)}
                    />
                    <small>{draft.title.length}/60</small>
                  </label>
                  <label>
                    Короткое описание
                    <textarea
                      required
                      rows={4}
                      value={draft.description}
                      onChange={(e) => update("description", e.target.value)}
                    />
                  </label>
                  <label>
                    Категория
                    <select
                      value={draft.category}
                      onChange={(e) => update("category", e.target.value)}
                    >
                      <option>
                        {type === "challenge"
                          ? "Танцы"
                          : type === "story"
                            ? "Вдохновение"
                            : "Социальная помощь"}
                      </option>
                      <option>Творчество</option>
                      <option>Спорт</option>
                    </select>
                  </label>
                  {type === "campaign" && (
                    <label>
                      Цель сбора
                      <div className="suffix-input">
                        <input
                          inputMode="numeric"
                          value={draft.goal || ""}
                          onChange={(e) =>
                            update(
                              "goal",
                              Number(e.target.value.replace(/\D/g, "")),
                            )
                          }
                        />
                        <span>₽</span>
                      </div>
                    </label>
                  )}
                </div>
              )}
              {step === 2 && (
                <div className="form-stack">
                  <label className="upload-zone">
                    <input
                      className="file-input"
                      type="file"
                      accept="video/mp4,video/quicktime,image/jpeg,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file && file.size > 200 * 1024 * 1024) {
                          setError("Файл больше 200 МБ");
                          return;
                        }
                        setError("");
                        update("media", file);
                      }}
                    />
                    <span>{labels.emoji}</span>
                    <strong>
                      {draft.media
                        ? draft.media.name
                        : "Загрузить обложку или видео"}
                    </strong>
                    <p>MP4, MOV, JPG или PNG • до 200 МБ</p>
                    <span className="button button-soft button-small">
                      Выбрать файл
                    </span>
                  </label>
                  {type === "challenge" && (
                    <>
                      <div className="form-two">
                        <label>
                          Призовой фонд
                          <div className="suffix-input">
                            <input
                              inputMode="numeric"
                              value={draft.prize || ""}
                              onChange={(e) =>
                                update(
                                  "prize",
                                  Number(e.target.value.replace(/\D/g, "")),
                                )
                              }
                            />
                            <span>₽</span>
                          </div>
                        </label>
                        <label>
                          Дата завершения
                          <input
                            min={new Date().toISOString().slice(0, 10)}
                            type="date"
                            value={draft.endsAt}
                            onChange={(e) => update("endsAt", e.target.value)}
                          />
                        </label>
                      </div>
                      <label>
                        Правила
                        <textarea
                          rows={4}
                          value={draft.rules}
                          onChange={(e) => update("rules", e.target.value)}
                        />
                      </label>
                    </>
                  )}
                  {type === "campaign" && (
                    <label className="upload-zone small">
                      <input
                        className="file-input"
                        type="file"
                        multiple
                        accept="application/pdf,image/jpeg,image/png"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (
                            files.some((file) => file.size > 20 * 1024 * 1024)
                          ) {
                            setError(
                              "Каждый документ должен быть не больше 20 МБ",
                            );
                            return;
                          }
                          setError("");
                          update("documents", files);
                        }}
                      />
                      <strong>
                        {draft.documents?.length
                          ? `Добавлено документов: ${draft.documents.length}`
                          : "Документы для проверки"}
                      </strong>
                      <p>Выписки, счета и подтверждающие документы</p>
                      <span className="button button-soft button-small">
                        Добавить документы
                      </span>
                    </label>
                  )}
                </div>
              )}
              {step === 3 && (
                <div className="review-card">
                  <span>
                    <Icon name="check" />
                  </span>
                  <h3>Всё готово к публикации</h3>
                  <p>
                    Проверьте данные в превью. После публикации основные условия
                    можно будет изменить только до первого участника.
                  </p>
                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(event) => setAccepted(event.target.checked)}
                    />{" "}
                    Я принимаю{" "}
                    <A href="/documents/content">правила публикации контента</A>
                  </label>
                </div>
              )}
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <div className="form-actions">
                <button
                  type="button"
                  className="button button-soft"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                >
                  Назад
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => setStep(step + 1)}
                    disabled={!draft.title.trim() || !draft.description.trim()}
                  >
                    Продолжить <Icon name="arrow" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={publishing || !accepted}
                    className="button button-primary"
                    onClick={publish}
                  >
                    {publishing
                      ? "Публикуем…"
                      : editing
                        ? "Сохранить изменения"
                        : labels.button}
                  </button>
                )}
              </div>
            </section>
            <aside className="create-preview">
              <span>Превью</span>
              <div
                className={`preview-phone poster-${type === "challenge" ? "violet" : type === "story" ? "pink" : "blue"}`}
              >
                <div className="phone-top">
                  <Brand />
                  <Icon name="bell" />
                </div>
                <span className="poster-emoji">{labels.emoji}</span>
                <div className="poster-caption">
                  <span>@sergey.deels</span>
                  <strong>{draft.title || "Название публикации"}</strong>
                  <small>{draft.description}</small>
                </div>
              </div>
              <p>Так карточка будет выглядеть в ленте</p>
            </aside>
          </div>
        )}
      </main>
    </PageShell>
  );
}

function ScreensPage() {
  return (
    <PageShell path="/screens">
      <main>
        <CatalogHero
          eyebrow="Дизайн‑система Deels"
          title="Все экраны"
          text="Кликабельная карта полного веб‑контура: публичная часть, личный кабинет и создание контента."
        />
        <section className="section">
          <div className="container screens-summary">
            <div>
              <strong>28</strong>
              <span>основных экранов</span>
            </div>
            <div>
              <strong>2</strong>
              <span>адаптивных режима</span>
            </div>
            <div>
              <strong>1</strong>
              <span>единая тема</span>
            </div>
          </div>
          <div className="container screens-groups">
            {screenGroups.map((group) => (
              <section key={group.title}>
                <h2>{group.title}</h2>
                <div>
                  {group.items.map(([label, href], i) => (
                    <A href={href} key={href}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <strong>{label}</strong>
                      <small>{href}</small>
                      <Icon name="arrow" />
                    </A>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function NotFound() {
  return (
    <PageShell path="/">
      <main className="empty-page theme-gradient">
        <span>404</span>
        <h1>Такой страницы пока нет</h1>
        <p>Зато в Deels уже есть тысячи идей, которые можно повторить.</p>
        <A href="/" className="button button-primary">
          На главную
        </A>
      </main>
    </PageShell>
  );
}

export function DeelsApp({ initialPath }: { initialPath: string }) {
  const path = useMemo(
    () => initialPath.replace(/\/$/, "") || "/",
    [initialPath],
  );
  if (path === "/") return <HomePage />;
  if (path === "/challenges") return <ChallengesPage />;
  if (/^\/challenges\/[^/]+\/respond$/.test(path))
    return <ChallengeResponsePage id={path.split("/")[2]} />;
  if (path.startsWith("/challenges/"))
    return <ChallengeDetail id={path.split("/")[2]} />;
  if (path === "/feed") return <FeedPage />;
  if (path === "/battles") return <BattlesPage />;
  if (path.startsWith("/battles/"))
    return <BattleDetail id={path.split("/")[2]} />;
  if (path === "/stories") return <StoriesPage />;
  if (path.startsWith("/stories/"))
    return <StoryDetail id={path.split("/")[2]} />;
  if (path === "/campaigns") return <CampaignsPage />;
  if (path.startsWith("/campaigns/"))
    return <CampaignDetail id={path.split("/")[2]} />;
  if (path.startsWith("/users/"))
    return <PublicProfilePage id={path.split("/")[2]} />;
  if (path === "/about-us") return <AboutPage />;
  if (path === "/contact-us") return <ContactPage />;
  if (path === "/offer") return <OfferPage />;
  if (path.startsWith("/documents/"))
    return <OfferPage slug={path.split("/")[2]} />;
  if (path === "/login" || path === "/register")
    return <AuthPage mode={path.slice(1) as "login" | "register"} />;
  if (path === "/forgot-password") return <ForgotPasswordPage />;
  if (path === "/reset-password") return <ResetPasswordPage />;
  if (path.startsWith("/verify-email/"))
    return <VerifyEmailPage token={path.split("/")[2]} />;
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
  if (path.startsWith("/edit/challenge/"))
    return <CreatePage type="challenge" editingId={path.split("/")[3]} />;
  if (path === "/screens") return <ScreensPage />;
  return <NotFound />;
}
