import { useUserStore } from "@/stores/user";
import type { Conversation, Message } from '../types/chat';

const getUserIdFromStore = () => {
    const userStore = useUserStore();
    const { user } = userStore;
    if (!user) {
        navigateTo("/account/login", { replace: true });
        return null;
    }
    return user.id;
}

export const useGetConversationList = async () => {
    const url = 'http://localhost:8000/api/chat/conversations/'
    const userId = getUserIdFromStore();
    if (!userId) return;
    const body = { 'user_id': userId }
    const { data } = await useFetch<Conversation[]>(url, { params: body })
    return data.value
}

export const useAddConversation = async (prompt: string) => {
    const url = 'http://localhost:8000/api/chat/conversations/create/'
    const userId = getUserIdFromStore();
    if (!userId) return;
    const body = {
        "prompt": prompt,
        "user_id": userId
    };
    type ConversationResponse = {
        conversation: Conversation,
        new_prompt: Message,
        new_ai_res: Message,
    }
    const { data } = await useFetch<ConversationResponse>(url, { method: 'POST', params: body })
    return data.value
}

export const useGetMessageList = async (conversationId: string) => {
    const url = 'http://localhost:8000/api/chat/conversations/' + conversationId + '/messages/'
    const userId = getUserIdFromStore();
    if (!userId) return;
    const body = { 'user_id': userId }
    const { data } = await useFetch<Message[]>(url, { params: body })
    return data.value
}

export const useAddPrompt = async (conversationId: string, prompt: string) => {
    const url = 'http://localhost:8000/api/chat/conversations/' + conversationId + '/messages/create/'
    const userId = getUserIdFromStore();
    if (!userId) return;
    const body = {
        "conversation": conversationId,
        "message": prompt,
        "is_bot": false,
        "user": userId
    };
    const { data } = await useFetch<Message>(url, { method: 'POST', body: body })
    return data.value
}

export const useAddAiResponse = async (conversationId: string, prompt: string) => {
    const url = 'http://localhost:8000/api/chat/conversations/' + conversationId + '/messages/create/ai/'
    const userId = getUserIdFromStore();
    if (!userId) return;
    const body = {
        "conversation": conversationId,
        "message": prompt,
        "is_bot": true,
        "user": userId
    };
    const { data } = await useFetch<Message>(url, { method: 'POST', body: body })
    return data.value
}