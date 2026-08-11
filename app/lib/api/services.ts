import { apiRequest, setAccessToken, unwrapData, unwrapList } from "./client";
import { endpoints } from "./endpoints";
import { apiConfig } from "./config";
import {
  asRecord,
  mapBattle,
  mapCampaign,
  mapChallenge,
  mapDialog,
  mapMessage,
  mapNotification,
  mapStory,
  mapStats,
  mapUser,
  mapWallet,
} from "./mappers";
import type {
  AuthResult,
  BattleView,
  CampaignView,
  ChallengeView,
  ContentDraft,
  ContentType,
  DialogView,
  LoginPayload,
  MessageView,
  NotificationView,
  PageResult,
  RegisterPayload,
  ResetPasswordPayload,
  SearchResultView,
  StoryView,
  StatsView,
  UnknownRecord,
  UserView,
  WalletView,
} from "./types";

function page<T>(payload: unknown, mapper: (row: unknown) => T): PageResult<T> {
  const result = unwrapList(payload);
  return {
    items: result.rows.map(mapper),
    total: result.total,
    nextPage: result.nextPage,
    nextCursor: result.nextCursor,
  };
}

function query(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  if (!params) return path;
  const url = new URL(path, "https://deels.local");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "")
      url.searchParams.set(key, String(value));
  });
  return `${url.pathname}${url.search}`;
}

function navigationUrl(path: string, params?: Record<string, string>): string {
  const base = apiConfig.baseUrl.replace(/\/$/, "");
  const target = `${base}/${path.replace(/^\//, "")}`;
  if (!params) return target;
  const search = new URLSearchParams(params).toString();
  return search
    ? `${target}${target.includes("?") ? "&" : "?"}${search}`
    : target;
}

function contentBody(draft: ContentDraft): FormData {
  const data = new FormData();
  data.set("title", draft.title);
  data.set("description", draft.description);
  data.set("category", draft.category);
  if (draft.goal !== undefined) data.set("goal", String(draft.goal));
  if (draft.prize !== undefined) data.set("prize", String(draft.prize));
  if (draft.endsAt) data.set("ends_at", draft.endsAt);
  if (draft.rules) data.set("rules", draft.rules);
  if (draft.media) data.set("media", draft.media);
  draft.documents?.forEach((file) => data.append("documents[]", file));
  return data;
}

function authResult(payload: unknown): AuthResult {
  const data = asRecord(unwrapData<unknown>(payload));
  const user = mapUser(data.user ?? data.profile ?? data);
  const accessToken =
    typeof (data.access_token ?? data.token) === "string"
      ? String(data.access_token ?? data.token)
      : undefined;
  if (accessToken) setAccessToken(accessToken);
  return {
    user,
    accessToken,
    emailVerificationRequired: Boolean(
      data.email_verification_required ?? data.must_verify_email,
    ),
  };
}

export const deelsApi = Object.freeze({
  auth: {
    login: async (payload: LoginPayload) =>
      authResult(
        await apiRequest(endpoints.auth.login, {
          method: "POST",
          body: payload,
        }),
      ),
    register: async (payload: RegisterPayload) =>
      authResult(
        await apiRequest(endpoints.auth.register, {
          method: "POST",
          body: {
            ...payload,
            password_confirmation: payload.passwordConfirmation,
            terms_accepted: payload.termsAccepted,
            privacy_accepted: payload.privacyAccepted,
            content_rules_accepted: payload.contentRulesAccepted,
            marketing_accepted: payload.marketingAccepted ?? false,
          },
        }),
      ),
    logout: async () => {
      await apiRequest(endpoints.auth.logout, { method: "POST" });
      setAccessToken();
    },
    forgotPassword: async (email: string) => {
      await apiRequest(endpoints.auth.forgotPassword, {
        method: "POST",
        body: { email },
      });
    },
    resetPassword: async (payload: ResetPasswordPayload) => {
      await apiRequest(endpoints.auth.resetPassword, {
        method: "POST",
        body: {
          ...payload,
          password_confirmation: payload.passwordConfirmation,
        },
      });
    },
    verifyEmail: async (token: string) => {
      await apiRequest(endpoints.auth.verifyEmail(token), {
        method: "POST",
      });
    },
    resendVerification: async () => {
      await apiRequest(endpoints.auth.resendVerification, { method: "POST" });
    },
    oauthUrl: (provider: "vk", returnUrl: string) =>
      navigationUrl(endpoints.auth.oauth(provider), { return_url: returnUrl }),
    me: async (): Promise<UserView> =>
      mapUser(unwrapData(await apiRequest(endpoints.auth.me))),
  },
  stats: {
    summary: async (): Promise<StatsView> =>
      mapStats(unwrapData(await apiRequest(endpoints.stats))),
  },
  challenges: {
    list: async (
      params?: Record<string, string | number | boolean | undefined>,
    ): Promise<PageResult<ChallengeView>> =>
      page(
        await apiRequest(query(endpoints.challenges.list, params)),
        mapChallenge,
      ),
    detail: async (id: string) =>
      mapChallenge(
        unwrapData(await apiRequest(endpoints.challenges.detail(id))),
      ),
    create: async (draft: ContentDraft) =>
      mapChallenge(
        unwrapData(
          await apiRequest(endpoints.challenges.create, {
            method: "POST",
            body: contentBody(draft),
          }),
        ),
      ),
    update: async (id: string, draft: ContentDraft) => {
      const body = contentBody(draft);
      body.set("_method", "PUT");
      return mapChallenge(
        unwrapData(
          await apiRequest(endpoints.challenges.update(id), {
            method: "POST",
            body,
          }),
        ),
      );
    },
    join: async (id: string, media: File, caption: string) => {
      const body = new FormData();
      body.set("media", media);
      body.set("caption", caption);
      return unwrapData<UnknownRecord>(
        await apiRequest(endpoints.challenges.join(id), {
          method: "POST",
          body,
        }),
      );
    },
    save: async (id: string) =>
      unwrapData<UnknownRecord>(
        await apiRequest(endpoints.challenges.save(id), { method: "POST" }),
      ),
    vote: async (id: string | number) => {
      await apiRequest(endpoints.challenges.vote(id), { method: "POST" });
    },
  },
  feed: {
    list: async (
      params?: Record<string, string | number | boolean | undefined>,
    ): Promise<PageResult<ChallengeView>> =>
      page(await apiRequest(query(endpoints.feed, params)), mapChallenge),
  },
  battles: {
    list: async (
      params?: Record<string, string | number | boolean | undefined>,
    ): Promise<PageResult<BattleView>> =>
      page(await apiRequest(query(endpoints.battles.list, params)), mapBattle),
    vote: async (battleId: string | number, sideId: string | number) =>
      unwrapData<UnknownRecord>(
        await apiRequest(endpoints.battles.vote(battleId), {
          method: "POST",
          body: { side_id: sideId, response_id: sideId },
        }),
      ),
  },
  stories: {
    list: async (
      params?: Record<string, string | number | boolean | undefined>,
    ): Promise<PageResult<StoryView>> =>
      page(await apiRequest(query(endpoints.stories.list, params)), mapStory),
    detail: async (id: string) =>
      mapStory(unwrapData(await apiRequest(endpoints.stories.detail(id)))),
    create: async (draft: ContentDraft) =>
      mapStory(
        unwrapData(
          await apiRequest(endpoints.stories.create, {
            method: "POST",
            body: contentBody(draft),
          }),
        ),
      ),
  },
  campaigns: {
    list: async (
      params?: Record<string, string | number | boolean | undefined>,
    ): Promise<PageResult<CampaignView>> =>
      page(
        await apiRequest(query(endpoints.campaigns.list, params)),
        mapCampaign,
      ),
    detail: async (id: string) =>
      mapCampaign(unwrapData(await apiRequest(endpoints.campaigns.detail(id)))),
    create: async (draft: ContentDraft) =>
      mapCampaign(
        unwrapData(
          await apiRequest(endpoints.campaigns.create, {
            method: "POST",
            body: contentBody(draft),
          }),
        ),
      ),
    donate: async (
      id: string | number,
      amount: number,
      anonymous = false,
    ): Promise<UnknownRecord> =>
      unwrapData(
        await apiRequest(endpoints.campaigns.donate(id), {
          method: "POST",
          body: { amount, anonymous },
        }),
      ),
  },
  profile: {
    me: async (): Promise<UserView> =>
      mapUser(unwrapData(await apiRequest(endpoints.profile.me))),
    update: async (payload: UnknownRecord): Promise<UserView> =>
      mapUser(
        unwrapData(
          await apiRequest(endpoints.profile.update, {
            method: "PATCH",
            body: payload,
          }),
        ),
      ),
    uploadAvatar: async (file: File): Promise<UserView> => {
      const body = new FormData();
      body.set("avatar", file);
      return mapUser(
        unwrapData(
          await apiRequest(endpoints.profile.uploadAvatar, {
            method: "POST",
            body,
          }),
        ),
      );
    },
  },
  users: {
    detail: async (id: string | number): Promise<UserView> =>
      mapUser(unwrapData(await apiRequest(endpoints.users.detail(id)))),
    content: async (
      id: string | number,
      params?: Record<string, string | number | boolean | undefined>,
    ): Promise<PageResult<ChallengeView>> =>
      page(
        await apiRequest(query(endpoints.users.content(id), params)),
        mapChallenge,
      ),
  },
  wallet: {
    summary: async (): Promise<WalletView> =>
      mapWallet(unwrapData(await apiRequest(endpoints.wallet.summary))),
    deposit: async (
      amount: number,
      returnUrl?: string,
    ): Promise<UnknownRecord> =>
      unwrapData(
        await apiRequest(endpoints.wallet.deposit, {
          method: "POST",
          body: { amount, return_url: returnUrl },
        }),
      ),
    withdraw: async (
      amount: number,
      paymentMethodId?: string,
    ): Promise<UnknownRecord> =>
      unwrapData(
        await apiRequest(endpoints.wallet.withdraw, {
          method: "POST",
          body: { amount, payment_method_id: paymentMethodId },
        }),
      ),
  },
  messages: {
    dialogs: async (): Promise<PageResult<DialogView>> =>
      page(await apiRequest(endpoints.messages.dialogs), mapDialog),
    thread: async (id: string | number): Promise<PageResult<MessageView>> =>
      page(await apiRequest(endpoints.messages.thread(id)), mapMessage),
    send: async (id: string | number, text: string): Promise<UnknownRecord> =>
      unwrapData(
        await apiRequest(endpoints.messages.send(id), {
          method: "POST",
          body: { text },
        }),
      ),
  },
  notifications: {
    list: async (
      params?: Record<string, string | number | boolean | undefined>,
    ): Promise<PageResult<NotificationView>> =>
      page(
        await apiRequest(query(endpoints.notifications.list, params)),
        mapNotification,
      ),
    read: async (id: string | number) => {
      await apiRequest(endpoints.notifications.read(id), { method: "POST" });
    },
    readAll: async () => {
      await apiRequest(endpoints.notifications.readAll, { method: "POST" });
    },
  },
  settings: {
    updatePreferences: async (payload: UnknownRecord) =>
      unwrapData<UnknownRecord>(
        await apiRequest(endpoints.settings.preferences, {
          method: "PATCH",
          body: payload,
        }),
      ),
    changePassword: async (
      currentPassword: string,
      password: string,
      passwordConfirmation: string,
    ) =>
      unwrapData<UnknownRecord>(
        await apiRequest(endpoints.settings.password, {
          method: "PUT",
          body: {
            current_password: currentPassword,
            password,
            password_confirmation: passwordConfirmation,
          },
        }),
      ),
    closeOtherSessions: async () => {
      await apiRequest(endpoints.settings.closeSessions, { method: "POST" });
    },
  },
  social: {
    like: async (type: string, id: string | number) =>
      unwrapData<UnknownRecord>(
        await apiRequest(endpoints.social.like(type, id), { method: "POST" }),
      ),
    unlike: async (type: string, id: string | number) =>
      unwrapData<UnknownRecord>(
        await apiRequest(endpoints.social.unlike(type, id), {
          method: "DELETE",
        }),
      ),
    comment: async (type: string, id: string | number, text: string) =>
      unwrapData<UnknownRecord>(
        await apiRequest(endpoints.social.comment(type, id), {
          method: "POST",
          body: { text },
        }),
      ),
    share: async (type: string, id: string | number) => {
      await apiRequest(endpoints.social.share(type, id), { method: "POST" });
    },
    follow: async (id: string | number) => {
      await apiRequest(endpoints.social.follow(id), { method: "POST" });
    },
  },
  search: {
    all: async (search: string): Promise<SearchResultView> => {
      const raw = asRecord(
        unwrapData(await apiRequest(endpoints.search(search))),
      );
      const users = Array.isArray(raw.users)
        ? raw.users
        : Array.isArray(raw.authors)
          ? raw.authors
          : [];
      return {
        challenges: (Array.isArray(raw.challenges) ? raw.challenges : []).map(
          mapChallenge,
        ),
        stories: (Array.isArray(raw.stories) ? raw.stories : []).map(mapStory),
        campaigns: (Array.isArray(raw.campaigns) ? raw.campaigns : []).map(
          mapCampaign,
        ),
        users: users.map(mapUser),
        raw,
      };
    },
  },
  contacts: {
    send: async (payload: UnknownRecord) => {
      await apiRequest(endpoints.contacts, {
        method: "POST",
        body: payload,
      });
    },
  },
  async createContent(
    type: ContentType,
    draft: ContentDraft,
    editingId?: string,
  ) {
    if (type === "challenge")
      return editingId
        ? deelsApi.challenges.update(editingId, draft)
        : deelsApi.challenges.create(draft);
    if (type === "story") return deelsApi.stories.create(draft);
    return deelsApi.campaigns.create(draft);
  },
});
