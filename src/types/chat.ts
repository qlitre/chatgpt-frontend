/*

class Conversation(models.Model):
    """チャットトピック"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.topic


class Message(models.Model):
    """チャットメッセージ"""
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    tokens = models.IntegerField(default=0)
    is_bot = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


*/

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