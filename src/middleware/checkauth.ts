import { useAuthStore } from "~/stores/auth"
import { useUserStore } from "~/stores/user"
import { AUTH_BASE_URL } from "~/settings/siteSettings";


const getauthToken = () => {
    const userStore = useUserStore()
    return userStore.user.auth_token
}

type CheckAuthResponse = {
    isAuthenticated: boolean;
}

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const csrfToken = useCookie('csrftoken')
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${getauthToken()}`
    };
    if (csrfToken?.value) {
        headers['X-CSRFToken'] = csrfToken.value;
    }
    const response: CheckAuthResponse = await $fetch(AUTH_BASE_URL + "account/checkauth/", {
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