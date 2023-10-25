import type { Conversation, Message, ConversationListResponse, ConversationListParams } from '../types/chat';
import { onLogout } from '../utils/logout';


type NewConversationResponse = {
    conversation: Conversation,
    new_prompt: Message,
    new_ai_res: Message,
}

type err = {
    detail: string
}

type UseAddConversationResult = {
    error?: err | null;
    data?: NewConversationResponse | null;
};


type UseAddMessageResult = {
    error?: err | null;
    data?: Message | null;
};

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

export const useGetConversationList = async (params: ConversationListParams) => {
    let url = `http://localhost:8000/api/chat/conversations/`
    const { data, error } = await useFetch<ConversationListResponse>(url, { params: params, credentials: 'include' })
    if (error.value) {
        await onLogout()
    }
    return data.value
}

export const useGetConvesationDetail = async (conversationId: string) => {
    const url = 'http://localhost:8000/api/chat/conversations/' + conversationId + '/'
    const { data, error } = await useFetch<Conversation>(url, { credentials: 'include' })
    if (error.value) {
        console.log(error.value)
        await onLogout()
    }
    return data.value
}

export const useAddConversation = async (prompt: string): Promise<UseAddConversationResult> => {
    const url = 'http://localhost:8000/api/chat/conversations/create/'
    const body = {
        "prompt": prompt,
    };
    const headers = getPostHeader();
    const { data, error } = await useFetch<NewConversationResponse>(url,
        { method: 'POST', headers: headers, body: body, credentials: 'include' })
    if (error.value) {
        if (error.value.statusCode == 403) {
            console.log("Forbidden")
            await onLogout()
        }
        return { error: error.value.data, data: null };
    }
    return { data: data.value };
}


export const useAddMessage = async (conversationId: string, prompt: string): Promise<UseAddMessageResult> => {
    const url = 'http://localhost:8000/api/chat/conversations/' + conversationId + '/messages/create/'
    const body = {
        "message": prompt,
    };
    const headers = getPostHeader();
    const { data, error } = await useFetch<Message>(url, { method: 'POST', headers: headers, body: body, credentials: 'include' })
    if (error.value) {
        if (error.value?.statusCode == 403) {
            console.log(error.value)
            await onLogout()
        }
        return { error: error.value.data, data: null };
    }

    return { data: data.value };
}