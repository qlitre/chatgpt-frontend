<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import hljs from "highlight.js"

import type { Message } from '../types/chat';
import { ref } from 'vue'

const history = ref<Message[]>([]);
const prompt = ref("")
const loading = ref(false);
// ChatGPTと通信中かどうか
const isCommunicating = ref(false);

/**
 * 送信ボタンが押されたときに実行
 */
async function addPrompt() {
    if (!canSend()) return
    isCommunicating.value = true
    const _prompt = prompt.value
    prompt.value = ""
    // streamする
    try {
        const response = await useGetStreamChat(_prompt);
        if (response.body == null) return
        history.value.push({ is_bot: false, message: _prompt })
        history.value.push({ is_bot: true, message: '' })
        const reader = response.body.getReader();
        let decoder = new TextDecoder();
        loading.value = false;
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            // chunk dataが２つ以上で送られてくる場合があるので、{}で分割する
            const jsonArr: string[] = []
            const stack: string[] = []
            let flg = false
            for (const s of chunk) {
                if (s == '{') flg = true
                if (!flg) continue
                stack.push(s)
                if (s == '}') {
                    jsonArr.push(stack.join(''))
                    stack.length = 0
                    flg = false
                }
            }
            for (const json of jsonArr) {
                const parsedData = JSON.parse(json);
                if (parsedData.end_of_stream) {
                    isCommunicating.value = false
                    break;
                }
                if (parsedData.content) {
                    // 本番にデプロイするとチャンクが大きくなるので、25msごとに追加する
                    // 原因は良く分からない
                    for (const s of parsedData.content) {
                        await new Promise(r => setTimeout(r, 25));
                        history.value[1].message += s
                    }
                }
            }
        }
        isCommunicating.value = false
        const res = await useAddConversation(_prompt, history.value[1].message)
        if (res.data) {
            const newTopicId = res.data.conversation.id
            navigateTo(`/chat/conversation/${newTopicId}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }

}

/**
 * 送信できるかどうかを制御
 */
function canSend() {
    if (prompt.value.length == 0) return false
    if (isCommunicating.value) return false
    if (/^\s*$/.test(prompt.value)) return false
    return true
}


const md = new MarkdownIt({
    linkify: true,
    highlight(code: string, lang: string) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return `<pre class="hljs-code-container"><div class="hljs-code-header d-flex align-center justify-space-between bg-grey-darken-3 pa-1"><span class="pl-2 text-caption">${language}</span></div><code class="hljs language-${language}">${hljs.highlight(code, { language: language, ignoreIllegals: true }).value}</code></pre>`
    },
})

/**
 * Enterキーが単体で押されたときにチャットメッセージを送信
 * Shift + Enterの場合は改行
 */
function handleEnterPress(event: KeyboardEvent) {
    if (!event.shiftKey) {
        addPrompt();
        event.preventDefault();
    }
}

</script>

<template>
    <v-container class="top-container">
        <v-container class="pa-4 justify-center" v-for="item in history" :key="item.id">
            <v-card class="pt-4">
                <div class="chip">
                    <v-chip prepend-icon="lightbulb_outline" v-if="item.is_bot" color="green" text-color="white">
                        # AI Response
                    </v-chip>
                    <v-chip prepend-icon="account_circle" v-else color="blue" text-color="white">
                        # Your Prompt
                    </v-chip>
                </div>
                <div v-html="md.render(item.message)" class="md" />
            </v-card>
        </v-container>

        <div class="prompt-box">
            <div class="input-wrapper">
                <v-textarea class="textarea custom-textarea" v-model="prompt" auto-grow placeholder="メッセージを送信" rows="2"
                    max-rows="7" bg-color="white" density="compact" variant="solo"
                    @keyup.enter="handleEnterPress"></v-textarea>
                <v-btn size="small" :disabled="!canSend()" icon="send" class="send-button" color="primary"
                    @click="addPrompt()"></v-btn>
            </div>
        </div>
    </v-container>
</template>

<style scoped lang="scss">
.top-container {
    position: relative;
}

.prompt-box {
    padding-top: 30px;
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
}

.input-wrapper {
    position: relative;
}

.custom-textarea {
    width: 100%;
    box-sizing: border-box;
    overflow: auto;
}

.send-button {
    position: absolute;
    bottom: 30px;
    /* adjust this value to vertically center the button */
    right: 8px;
    /* adjust this value based on the desired position from the right edge */
}

.chip {
    padding: 0 4%;
}

.md {
    padding: 2% 4%;

    :deep(*) {
        margin-top: 0;
        margin-bottom: 1rem;
        line-height: 1.7;
        font-size: 1rem;
    }

    :deep(p) {
        line-height: 1.7;
        white-space: pre-wrap;

        +p {
            margin-top: 8px;
        }
    }

    :deep(img) {
        display: block;
        max-width: 100%;
        margin-top: 20px;
        margin-bottom: 0px;
        height: auto;
        border: solid 1px #ccc;
    }

    :deep(strong) {
        background-color: yellow;
    }

    :deep(p) code,
    :deep(li) code {
        padding-left: 4px;
        padding-right: 4px;
        border-radius: 4px;
        margin: 0 4px;
        background-color: #E2E8F0;
        color: #1A202C;
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 0.875rem;
        display: inline-block;
    }

    :deep(pre) * {
        line-height: 1.6;
        font-weight: normal;
        font-size: 0.875rem;
        margin-bottom: 0;
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }

    :deep(.toolbar-item) {
        font-size: 0.875rem;
    }

    :deep(blockquote) {
        margin: 1.5rem 0;
        padding-left: 15px;
        border-left: 2px solid #CBD5E0;
        border-radius: 2px;
        color: #718096;
    }

    :deep(h1):deep(h2),
    :deep(h3) {
        font-size: 1.25rem;
        font-weight: bold;
        margin-top: 1rem;
        margin-bottom: 1rem;

    }

    :deep(a) {
        color: #1266f1;

        :hover {
            opacity: .5;
        }
    }

    :deep(ul),
    :deep(ol) {
        padding-left: 1.5rem;
        margin: 1rem 0;
        line-height: 1.7;

        li {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
        }
    }

    :deep(ul) {
        list-style-type: disc;
    }

    :deep(ol) {
        list-style-type: decimal;
    }

    :deep(table) {
        width: 100%;
        border-collapse: collapse;
        border-radius: .5rem;

        th,
        td {
            padding: .5rem 1rem;
            border: 1px solid gray;
        }
    }
}

@media (max-width: 1024px) {
    .md:deep(img) {
        max-width: 100%;
    }
}
</style>