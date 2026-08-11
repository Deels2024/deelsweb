import type {
  BattleSideView,
  BattleView,
  CampaignView,
  ChallengeView,
  DialogView,
  MessageView,
  NotificationView,
  StoryView,
  StatsView,
  UnknownRecord,
  UserView,
  WalletTransactionView,
  WalletView,
} from "./types";

const tones = ["violet", "coral", "blue", "pink", "lime", "orange"];
const emojiByCategory: Record<string, string> = {
  dance: "🕺",
  танцы: "🕺",
  music: "🎤",
  музыка: "🎤",
  sport: "🏆",
  спорт: "🏆",
  pets: "🐾",
  животные: "🐾",
  charity: "💜",
  добро: "🤍",
  travel: "🏙️",
  путешествия: "🏙️",
};

export function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function first(
  source: UnknownRecord,
  keys: string[],
  fallback: unknown = "",
): unknown {
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
}

function text(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "bigint")
    return String(value);
  return fallback;
}

function number(value: unknown, fallback = 0): number {
  const parsed = Number(
    String(value ?? "")
      .replace(/[^\d.,-]/g, "")
      .replace(",", "."),
  );
  return Number.isFinite(parsed) ? parsed : fallback;
}

function boolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (value === 1 || value === "1" || value === "true") return true;
  if (value === 0 || value === "0" || value === "false") return false;
  return fallback;
}

function formatMoney(value: unknown): string {
  if (typeof value === "string" && /[₽$€]/.test(value)) return value;
  return `${Math.round(number(value)).toLocaleString("ru-RU")} ₽`;
}

function compact(value: unknown): string {
  if (typeof value === "string" && /[KММК]/i.test(value)) return value;
  const amount = number(value);
  return amount >= 1_000
    ? new Intl.NumberFormat("ru-RU", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(amount)
    : String(amount);
}

function nested(source: UnknownRecord, keys: string[]): UnknownRecord {
  for (const key of keys) {
    const result = asRecord(source[key]);
    if (Object.keys(result).length) return result;
  }
  return {};
}

function tone(id: unknown, explicit?: unknown): string {
  const value = text(explicit);
  if (tones.includes(value)) return value;
  const hash = [...text(id, "deels")].reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
  return tones[hash % tones.length];
}

function categoryName(source: UnknownRecord): string {
  const category = nested(source, ["category", "rubric"]);
  return text(
    first(
      category,
      ["name", "title", "slug"],
      first(source, ["category_name", "category", "tag"], "Deels"),
    ),
    "Deels",
  );
}

function authorName(source: UnknownRecord): string {
  const author = nested(source, ["author", "user", "owner", "creator"]);
  return text(
    first(
      author,
      ["username", "nickname", "login", "name"],
      first(source, ["author_name", "username", "author"], "deels.team"),
    ),
    "deels.team",
  ).replace(/^@/, "");
}

function mediaUrl(source: UnknownRecord): string | undefined {
  const media = nested(source, ["media", "video", "cover", "image"]);
  const value = first(
    media,
    ["url", "src", "path"],
    first(source, ["media_url", "video_url", "cover_url", "image_url"]),
  );
  return text(value) || undefined;
}

export function mapChallenge(value: unknown): ChallengeView {
  const source = asRecord(value);
  const id = text(first(source, ["slug", "uuid", "id"], "challenge"));
  const category = categoryName(source);
  return {
    id,
    title: text(first(source, ["title", "name", "headline"], "Челлендж Deels")),
    author: authorName(source),
    prize: formatMoney(
      first(source, ["prize", "prize_fund", "prize_amount", "reward"], 0),
    ),
    participants: compact(
      first(
        source,
        [
          "participants",
          "participants_count",
          "responses_count",
          "videos_count",
        ],
        0,
      ),
    ),
    tag: category,
    emoji: text(
      first(
        source,
        ["emoji", "icon"],
        emojiByCategory[category.toLowerCase()] || "✦",
      ),
    ),
    tone: tone(id, source.tone),
    description:
      text(first(source, ["description", "text", "short_description"])) ||
      undefined,
    mediaUrl: mediaUrl(source),
    endsAt:
      text(first(source, ["ends_at", "end_date", "finish_at"])) || undefined,
    likes: number(first(source, ["likes_count", "likes"], 0)),
    comments: number(first(source, ["comments_count", "comments"], 0)),
    shares: number(first(source, ["shares_count", "shares"], 0)),
    saved: boolean(first(source, ["saved", "is_saved"], false)),
  };
}

export function mapStory(value: unknown): StoryView {
  const source = asRecord(value);
  const id = text(first(source, ["slug", "uuid", "id"], "story"));
  const seconds = number(first(source, ["duration", "duration_seconds"], 0));
  return {
    id,
    title: text(first(source, ["title", "name", "headline"], "История Deels")),
    author: authorName(source),
    time: text(
      first(
        source,
        ["duration_label", "reading_time"],
        seconds ? `${Math.max(1, Math.ceil(seconds / 60))} мин` : "2 мин",
      ),
    ),
    emoji: text(first(source, ["emoji", "icon"], "✨")),
    tone: tone(id, source.tone),
    description:
      text(first(source, ["description", "text", "body"])) || undefined,
    mediaUrl: mediaUrl(source),
    likes: number(first(source, ["likes_count", "likes"], 0)),
    comments: number(first(source, ["comments_count", "comments"], 0)),
  };
}

export function mapCampaign(value: unknown): CampaignView {
  const source = asRecord(value);
  const id = text(first(source, ["slug", "uuid", "id"], "campaign"));
  const raised = number(
    first(
      source,
      ["raised", "raised_amount", "collected", "current_amount"],
      0,
    ),
  );
  const goal = Math.max(
    1,
    number(first(source, ["goal", "goal_amount", "target_amount"], 1)),
  );
  const explicitPercent = number(
    first(source, ["progress", "progress_percent"], Number.NaN),
    Number.NaN,
  );
  return {
    id,
    title: text(first(source, ["title", "name", "headline"], "Копилка Deels")),
    raised: Number.isFinite(explicitPercent)
      ? Math.min(100, explicitPercent)
      : Math.min(100, Math.round((raised / goal) * 100)),
    sum: formatMoney(raised),
    goal: formatMoney(goal),
    emoji: text(first(source, ["emoji", "icon"], "💜")),
    tone: tone(id, source.tone),
    description:
      text(first(source, ["description", "text", "body"])) || undefined,
    mediaUrl: mediaUrl(source),
    verified: boolean(
      first(source, ["verified", "is_verified", "documents_verified"], false),
    ),
    organizer:
      text(first(source, ["organizer_name", "beneficiary_name"])) ||
      authorName(source),
  };
}

export function mapUser(value: unknown): UserView {
  const source = asRecord(value);
  const firstName = text(first(source, ["first_name", "name"], "Пользователь"));
  const lastName = text(first(source, ["last_name", "surname"]));
  const name = text(
    first(source, ["full_name"], `${firstName} ${lastName}`.trim()),
  );
  return {
    id: text(first(source, ["uuid", "id"], "me")),
    name,
    username: text(
      first(source, ["username", "nickname", "login"], "deels.user"),
    ).replace(/^@/, ""),
    email: text(source.email) || undefined,
    phone: text(source.phone) || undefined,
    city: text(first(source, ["city", "location"])) || undefined,
    bio: text(first(source, ["bio", "about", "description"])) || undefined,
    avatarUrl: mediaUrl(source),
    initials:
      name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "D",
    followers: compact(first(source, ["followers", "followers_count"], 0)),
    posts: compact(first(source, ["posts", "posts_count", "content_count"], 0)),
    votes: compact(
      first(source, ["votes", "votes_count", "received_votes_count"], 0),
    ),
    wins: compact(first(source, ["wins", "wins_count", "victories_count"], 0)),
    verified: boolean(first(source, ["verified", "is_verified"], false)),
  };
}

export function mapStats(value: unknown): StatsView {
  const source = asRecord(value);
  return {
    creators: compact(
      first(source, ["creators", "users_count", "authors_count"], 0),
    ),
    responses: compact(
      first(source, ["responses", "responses_count", "videos_count"], 0),
    ),
    votes: compact(first(source, ["votes", "votes_count"], 0)),
    campaigns: formatMoney(
      first(
        source,
        ["campaigns", "campaigns_amount", "donations_amount", "raised_amount"],
        0,
      ),
    ),
  };
}

function mapBattleSide(
  value: unknown,
  fallbackId: string,
  fallbackPercent: number,
): BattleSideView {
  const source = asRecord(value);
  const id = text(first(source, ["response_id", "uuid", "id"], fallbackId));
  const votes = number(first(source, ["votes", "votes_count"], 0));
  return {
    id,
    author: authorName(source),
    emoji: text(first(source, ["emoji", "icon"], "▶")),
    tone: tone(id, source.tone),
    percent: number(
      first(source, ["percent", "vote_percent"], fallbackPercent),
      fallbackPercent,
    ),
    votes,
    mediaUrl: mediaUrl(source),
  };
}

export function mapBattle(value: unknown): BattleView {
  const source = asRecord(value);
  const id = text(first(source, ["uuid", "id"], "battle"));
  const rawSides = Array.isArray(source.sides)
    ? source.sides
    : [source.left ?? source.first, source.right ?? source.second];
  const left = mapBattleSide(rawSides[0], `${id}-left`, 50);
  const right = mapBattleSide(rawSides[1], `${id}-right`, 50);
  const totalVotes = number(
    first(source, ["total_votes", "votes_count"], left.votes + right.votes),
  );
  return {
    id,
    title: text(first(source, ["title", "challenge_title"], "Баттл Deels")),
    round: text(first(source, ["round_label", "round"], "Раунд")),
    endsIn: text(first(source, ["ends_in", "time_left"], "")),
    totalVotes,
    status:
      text(first(source, ["status"], "active")) === "finished"
        ? "finished"
        : "active",
    sides: [left, right],
    votedSideId:
      text(first(source, ["voted_side_id", "user_vote"])) || undefined,
  };
}

export function mapWalletTransaction(value: unknown): WalletTransactionView {
  const source = asRecord(value);
  const amount = number(first(source, ["amount", "sum"], 0));
  const direction = text(first(source, ["direction", "type"])).toLowerCase();
  const credit =
    direction === "credit" || direction === "income" || amount >= 0;
  return {
    id: text(first(source, ["uuid", "id"], `${Date.now()}-${Math.random()}`)),
    title: text(
      first(source, ["title", "description", "operation"], "Операция"),
    ),
    amount: `${credit ? "+" : "−"}${formatMoney(Math.abs(amount))}`,
    occurredAt: text(first(source, ["occurred_at", "created_at", "date"], "")),
    direction: credit ? "credit" : "debit",
  };
}

export function mapWallet(value: unknown): WalletView {
  const source = asRecord(value);
  const raw = Array.isArray(source.transactions) ? source.transactions : [];
  return {
    available: formatMoney(
      first(source, ["available", "available_balance", "balance"], 0),
    ),
    pending: formatMoney(
      first(source, ["pending", "pending_balance", "hold"], 0),
    ),
    transactions: raw.map(mapWalletTransaction),
  };
}

export function mapDialog(value: unknown): DialogView {
  const source = asRecord(value);
  const user = nested(source, ["user", "peer", "recipient"]);
  const title = text(
    first(
      user,
      ["full_name", "name", "username"],
      first(source, ["title", "name"], "Диалог"),
    ),
  );
  return {
    id: text(first(source, ["uuid", "id"], title)),
    title,
    avatar: title
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase(),
    preview: text(first(source, ["preview", "last_message", "message"])),
    time: text(first(source, ["time", "updated_at", "created_at"])),
    unread: number(first(source, ["unread", "unread_count"], 0)),
  };
}

export function mapMessage(value: unknown): MessageView {
  const source = asRecord(value);
  const outgoing = boolean(
    first(source, ["outgoing", "is_mine", "from_me"], false),
  );
  return {
    id: text(first(source, ["uuid", "id"], `${Date.now()}-${Math.random()}`)),
    text: text(first(source, ["text", "message", "body"])),
    time: text(first(source, ["time", "created_at", "sent_at"])),
    direction: outgoing ? "outgoing" : "incoming",
    status: text(first(source, ["status"], "")) as MessageView["status"],
  };
}

export function mapNotification(value: unknown): NotificationView {
  const source = asRecord(value);
  const rawCategory = text(first(source, ["category", "type"], "system"));
  const category: NotificationView["category"] = /challenge/i.test(rawCategory)
    ? "challenge"
    : /activity|like|follow|vote/i.test(rawCategory)
      ? "activity"
      : "system";
  return {
    id: text(first(source, ["uuid", "id"], `${Date.now()}-${Math.random()}`)),
    title: text(first(source, ["title", "subject"], "Уведомление")),
    text: text(first(source, ["text", "message", "body"])),
    time: text(first(source, ["time", "created_at", "date"])),
    unread: !boolean(first(source, ["read", "is_read"], false)),
    icon: text(first(source, ["icon", "emoji"], "✦")),
    category,
  };
}
