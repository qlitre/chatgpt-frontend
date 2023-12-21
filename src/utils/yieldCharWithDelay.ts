export function* yieldCharWithDelay(jsonArr: string[]) {
    for (const json of jsonArr) {
        const parsedData = JSON.parse(json);
        if (parsedData.content) {
            for (const s of parsedData.content) {
                yield s;
            }
        }
    }
}
