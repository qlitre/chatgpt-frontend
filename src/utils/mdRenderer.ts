import MarkdownIt from 'markdown-it'
import hljs from "highlight.js"


const md = new MarkdownIt({
    linkify: true,
    highlight(code: string, lang: string) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return `<pre class="hljs-code-container"><div class="hljs-code-header d-flex align-center justify-space-between bg-grey-darken-3 pa-1"><span class="pl-2 text-caption">${language}</span></div><code class="hljs language-${language}">${hljs.highlight(code, { language: language, ignoreIllegals: true }).value}</code></pre>`
    },
})

export const mdRenderer = (text: string) => {
    return md.render(text)
}