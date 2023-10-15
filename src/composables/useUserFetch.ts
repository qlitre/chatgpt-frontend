import { useUserStore } from "@/stores/user";
import type { Conversation, Message, ConversationListResponse } from '../types/chat';
import { onLogout } from '../utils/logout';

const getUserIdFromStore = () => {
    const userStore = useUserStore();
    const { user } = userStore;
    return user.id;
}

const getPostHeader = () => {
    let csrfToken = useCookie('csrftoken')
    if (!csrfToken.value) {
        throw new Error('CSRF token is missing!');
    }
    return {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken.value
    }
}

export const useGetConversationList = async (p: number = 1, q: string = '') => {
    const url = `http://localhost:8000/api/chat/conversations?page=${p}&keyword=${q}`
    const userId = getUserIdFromStore();
    const body = { 'user_id': userId }
    const { data, error } = await useFetch<ConversationListResponse>(url, { params: body, credentials: 'include' })
    if (error.value) {
        console.log(error.value)
        await onLogout()
    }
    return data.value
}

export const useAddConversation = async (prompt: string) => {
    const url = 'http://localhost:8000/api/chat/conversations/create/'
    const userId = getUserIdFromStore();
    const body = {
        "prompt": prompt,
        "user_id": userId
    };
    type ConversationResponse = {
        conversation: Conversation,
        new_prompt: Message,
        new_ai_res: Message,
    }
    const headers = getPostHeader();
    const { data, error } = await useFetch<ConversationResponse>(url, { method: 'POST', headers: headers, params: body, credentials: 'include' })
    if (error.value) {
        console.log(error.value)
        await onLogout()
    }
    return data.value
}

export const useGetMessageList = async (conversationId: string) => {
    const url = 'http://localhost:8000/api/chat/conversations/' + conversationId + '/messages/'
    const userId = getUserIdFromStore();
    const body = { 'user_id': userId }
    const { data, error } = await useFetch<Message[]>(url, { params: body, credentials: 'include' })
    if (error.value) {
        console.log(error.value)
        await onLogout()
    }

    return data.value
}

export const useAddPrompt = async (conversationId: string, prompt: string) => {
    const url = 'http://localhost:8000/api/chat/conversations/' + conversationId + '/messages/create/'
    const userId = getUserIdFromStore();
    const body = {
        "conversation": conversationId,
        "message": prompt,
        "is_bot": false,
        "user": userId
    };
    const headers = getPostHeader();
    const { data, error } = await useFetch<Message>(url, { method: 'POST', headers: headers, body: body, credentials: 'include' })
    if (error.value) {
        console.log(error.value)
        await onLogout()
    }
    return data.value
}

export const useAddAiResponse = async (conversationId: string, prompt: string) => {
    const url = 'http://localhost:8000/api/chat/conversations/' + conversationId + '/messages/create/ai/'
    const userId = getUserIdFromStore();
    const body = {
        "conversation": conversationId,
        "message": prompt,
        "is_bot": true,
        "user": userId
    };
    const headers = getPostHeader();
    const { data, error } = await useFetch<Message>(url, { method: 'POST', headers: headers, body: body, credentials: 'include' })
    if (error.value) {
        console.log(error.value)
        await onLogout()
    }
    return data.value
}