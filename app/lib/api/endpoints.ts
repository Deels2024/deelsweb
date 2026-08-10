import { apiConfig } from "./config";
const encode = (value: string | number) => encodeURIComponent(String(value));
const api = (path: string) => `${apiConfig.apiPrefix}/${path.replace(/^\//, "")}`.replace(/\/{2,}/g, "/");

/** Единственная карта адресов старого бэкенда. Меняется здесь, а не в компонентах. */
export const endpoints = Object.freeze({
  csrf: apiConfig.csrfPath,
  auth: { login: api("auth/login"), register: api("auth/register"), logout: api("auth/logout"), forgotPassword: api("auth/forgot-password"), me: api("user") },
  challenges: { list: api("challenges"), detail: (id: string) => api(`challenges/${encode(id)}`), create: api("challenges"), update: (id: string) => api(`challenges/${encode(id)}`), join: (id: string) => api(`challenges/${encode(id)}/responses`), vote: (id: string | number) => api(`challenge-responses/${encode(id)}/vote`) },
  feed: api("feed"),
  battles: { list: api("battles"), vote: (id: string | number) => api(`battles/${encode(id)}/vote`) },
  stories: { list: api("stories"), detail: (id: string) => api(`stories/${encode(id)}`), create: api("stories") },
  campaigns: { list: api("campaigns"), detail: (id: string) => api(`campaigns/${encode(id)}`), create: api("campaigns"), donate: (id: string | number) => api(`campaigns/${encode(id)}/donations`) },
  profile: { me: api("profile"), update: api("profile"), uploadAvatar: api("profile/avatar") },
  wallet: { summary: api("wallet"), transactions: api("wallet/transactions"), deposit: api("wallet/deposit"), withdraw: api("wallet/withdraw") },
  messages: { dialogs: api("messages/dialogs"), thread: (id: string | number) => api(`messages/dialogs/${encode(id)}`), send: (id: string | number) => api(`messages/dialogs/${encode(id)}/messages`) },
  notifications: { list: api("notifications"), read: (id: string | number) => api(`notifications/${encode(id)}/read`), readAll: api("notifications/read-all") },
  search: (query: string) => api(`search?q=${encode(query)}`),
  uploads: api("media"), contacts: api("contacts"),
});
