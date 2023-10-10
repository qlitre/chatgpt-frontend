import { useAuthStore } from "~/stores/auth"
import { useUserStore } from "~/stores/user"
import type { CheckAuthResponse } from "~/types/account"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const baseUrl = "http://localhost:8000/api/account/"
  const csrfToken = useCookie('csrftoken')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (csrfToken?.value) {
    headers['X-CSRFToken'] = csrfToken.value;
  }
  const response: CheckAuthResponse = await $fetch(baseUrl + 'checkauth/', {
    method: "GET",
    headers: headers,
    credentials: 'include',
  })
  if (!response) {
    return navigateTo("/account/login", { replace: true });
  }
  if (!response.isAuthenticated) {
    authStore.setAuthenticated(false)
    authStore.$reset();
    userStore.$reset();
    return navigateTo("/account/login", { replace: true });
  }
})