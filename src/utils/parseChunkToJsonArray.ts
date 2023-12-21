export const parseChunkToJsonArray = (chunk: string): string[] => {
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
    return jsonArr
}