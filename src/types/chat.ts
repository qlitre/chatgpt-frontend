export type Conversation = {
    id: number
    topic: string
    created_at: string
}

export type Message = {
    id: number
    message: string
    tokens: number
    is_bot: boolean
    created_at: string
}