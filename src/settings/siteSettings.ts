const ctx = useRuntimeConfig();
export const baseUrl = ctx.public.apiBase
export const AUTH_BASE_URL = baseUrl + '/auth/'
export const CHAT_BASE_URL = baseUrl + '/chat/'