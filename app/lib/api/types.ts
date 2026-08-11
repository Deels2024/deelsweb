export type ApiMode = "demo" | "auto" | "live";
export type AuthMode = "cookie" | "bearer";
export type ContentType = "challenge" | "story" | "campaign";
export type UnknownRecord = Record<string, unknown>;

export interface ChallengeView {
  id: string;
  title: string;
  author: string;
  prize: string;
  participants: string;
  tag: string;
  emoji: string;
  tone: string;
  description?: string;
  mediaUrl?: string;
  endsAt?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  saved?: boolean;
}

export interface StoryView {
  id: string;
  title: string;
  author: string;
  time: string;
  emoji: string;
  tone: string;
  description?: string;
  mediaUrl?: string;
  likes?: number;
  comments?: number;
}

export interface CampaignView {
  id: string;
  title: string;
  raised: number;
  sum: string;
  goal: string;
  emoji: string;
  tone: string;
  description?: string;
  mediaUrl?: string;
  verified?: boolean;
  organizer?: string;
}

export interface UserView {
  id: string;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  city?: string;
  bio?: string;
  avatarUrl?: string;
  initials: string;
  followers?: string;
  posts?: string;
  votes?: string;
  wins?: string;
  verified?: boolean;
}

export interface StatsView {
  creators: string;
  responses: string;
  votes: string;
  campaigns: string;
}

export interface BattleSideView {
  id: string;
  author: string;
  emoji: string;
  tone: string;
  percent: number;
  votes: number;
  mediaUrl?: string;
}

export interface BattleView {
  id: string;
  title: string;
  round: string;
  endsIn: string;
  totalVotes: number;
  status: "active" | "finished";
  sides: [BattleSideView, BattleSideView];
  votedSideId?: string;
}

export interface WalletTransactionView {
  id: string;
  title: string;
  amount: string;
  occurredAt: string;
  direction: "credit" | "debit";
}

export interface WalletView {
  available: string;
  pending: string;
  transactions: WalletTransactionView[];
}

export interface DialogView {
  id: string;
  title: string;
  avatar: string;
  preview: string;
  time: string;
  unread: number;
}

export interface MessageView {
  id: string;
  text: string;
  time: string;
  direction: "incoming" | "outgoing";
  status?: "sent" | "delivered" | "read";
}

export interface NotificationView {
  id: string;
  title: string;
  text: string;
  time: string;
  unread: boolean;
  icon: string;
  category?: "activity" | "challenge" | "system";
}

export interface SearchResultView {
  challenges: ChallengeView[];
  stories: StoryView[];
  campaigns: CampaignView[];
  users: UserView[];
  raw: UnknownRecord;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  nextPage?: number;
  nextCursor?: string;
}

export interface AuthResult {
  user: UserView;
  accessToken?: string;
  emailVerificationRequired?: boolean;
}

export interface LoginPayload {
  login: string;
  password: string;
  remember?: boolean;
}

export interface RegisterPayload {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  passwordConfirmation: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  contentRulesAccepted: boolean;
  marketingAccepted?: boolean;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface ContentDraft {
  title: string;
  description: string;
  category: string;
  goal?: number;
  prize?: number;
  endsAt?: string;
  rules?: string;
  media?: File | null;
  documents?: File[];
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | UnknownRecord | null;
  skipCsrf?: boolean;
  timeoutMs?: number;
}
