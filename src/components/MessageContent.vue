<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import hljs from "highlight.js"

type Props = {
    isBot: boolean,
    text: string,
    isRecentAI?: boolean,
    isTokenOver?: boolean,
}

interface Emits {
    // 関数名, 引数の型, 返り値の型
    (e: 'displayEnd', v: null): void;
}

const emits = defineEmits<Emits>();

const { isBot, text, isRecentAI } = defineProps<Props>()
const mdBody = ref('')

/**
 * 一文字ずつmdBodyに追加していく
 */
async function streamDisplay() {
    for (const s of text) {
        await new Promise(r => setTimeout(r, 10));
        mdBody.value += s;
    }
    // 親コンポーネントに表示が終了したことを教える
    emits('displayEnd', null);
}
/**
 * 最新のAIレスポンスの場合受け取った文字列を1文字ずつ表示
 */
if (isRecentAI) {
    streamDisplay()
} else {
    mdBody.value = text
}


const md = new MarkdownIt({
    linkify: true,
    highlight(code: string, lang: string) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return `<pre class="hljs-code-container"><div class="hljs-code-header d-flex align-center justify-space-between bg-grey-darken-3 pa-1"><span class="pl-2 text-caption">${language}</span></div><code class="hljs language-${language}">${hljs.highlight(code, { language: language, ignoreIllegals: true }).value}</code></pre>`
    },
})

const contentHtml = ref('')

watchEffect(async () => {
    contentHtml.value = mdBody.value ? md.render(mdBody.value) : ''
    await nextTick()
})

</script>

<template>
    <v-container class="pa-4 justify-center">
        <v-alert v-if="isTokenOver" type="error" class="mt-4">
            {{ text }}
        </v-alert>
        <v-card v-else class="pt-4">
            <div class="chip">
                <v-chip prepend-icon="lightbulb_outline" v-if="isBot" color="green" text-color="white">
                    # AI Response
                </v-chip>
                <v-chip prepend-icon="account_circle" v-else color="blue" text-color="white">
                    # Your Prompt
                </v-chip>
            </div>
            <div v-html="contentHtml" class="md" />
        </v-card>
    </v-container>
</template>

<style scoped lang="scss">
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