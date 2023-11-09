
/**
 * 作成の時に仮で組み立てるので、オプショナルにしておく
 * ここは改善の余地あり
 */
export type Message = {
    id?: number
    message: string
    tokens?: number
    is_bot: boolean
    created_at?: string
}

export type Conversation = {
    id: number
    topic: string
    created_at: string
    messages: Message[]
}

export type ConversationListResponse = {
    /**
     * its django response
     *  return response.Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'totalPages': self.page.paginator.num_pages,
            'currentPage': self.page.number,
            'results': data,
            'pageSize': self.page_size,
        })
     */
    next: string | null
    previous: string | null
    count: number
    totalPages: number
    currentPage: number
    pageSize: number
    results: Conversation[]
}

export type ConversationListParams = {
    page?: number,
    q?: string,
    excludeFields?: string[],
    fields?: string[],
}