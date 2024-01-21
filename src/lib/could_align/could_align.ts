// identify `tokenSize` sized substrings. Returns a map of locations of the tokens. Runs in (inputSize) * (tokenSize) time.
export function tokenIdPos(raw: string, tokenSize: number): Map<string, number[]> {
    if (tokenSize > raw.length) return new Map();
    else if (tokenSize == raw.length) return new Map([
        [raw, [0]]
    ]);

    const resultMap = new Map();

    for (let i = 0; i <= raw.length - tokenSize; i++) {
        const substr = raw.substring(i, i + tokenSize);
        const existing = resultMap.get(substr);

        if (existing == undefined) {
            resultMap.set(substr, [i])
        } else {
            resultMap.set(substr, [...existing, i]);
        }
    }

    return resultMap;

}

// identify `tokenSize` sized substrings. Returns a frequency map. Runs in (inputSize) * (tokenSize) time.
export function tokenIdFreq(raw: string, tokenSize: number): Map<string, number> {
    if (tokenSize > raw.length) return new Map();
    else if (tokenSize == raw.length) return new Map([
        [raw, 1]
    ]);

    const resultMap = new Map();

    for (let i = 0; i <= raw.length - tokenSize; i++) {
        const substr = raw.substring(i, i + tokenSize);
        const freq = resultMap.get(substr);

        if (freq == undefined) {
            resultMap.set(substr, 1)
        } else {
            resultMap.set(substr, freq + 1);
        }
    }

    return resultMap;
}

export function tokenIdFreqMany(inputs: string[], tokenSize: number): Map<string, number> {
    const maps = inputs
        .map((e) => tokenIdFreq(e, tokenSize));

    const map = new Map();

    for (const m of maps) {
        for (const [k, v] of m) {
            const freq = map.get(k);
            if (freq == undefined) {
                map.set(k, v);
            } else {
                map.set(k, freq + v);
            }
        }
    }

    return map;
}

export function evidenceTokenQuery(query: string, evidence: Map<string, number>, tokenSize: number): Map<string, number> {
    const queryTokens = tokenIdFreq(query, tokenSize);

    const resultMap = new Map();

    for (const [k, v] of queryTokens) {
        const freq = evidence.get(k) ?? 0;
        const current = resultMap.get(k) ?? 0;
        resultMap.set(k, current + freq / v);
    }

    return resultMap;
}

export function evidenceIndexQuery(query: string, evidence: Map<string, number>, tokenSize: number): number[] {
    const queryTokens = tokenIdPos(query, tokenSize);

    const hits = Array(query.length).fill(0);

    for (const [k, positions] of queryTokens) {
        for (const pos of positions) {
            const freq = evidence.get(k) ?? 0;
            const hit = freq / positions.length;

            for (let i = 0; i < tokenSize; i++) {
                const index = pos + i;
                hits[index] += hit;
            }
        }
    }

    const prevalence = (i: number) => Math.min(tokenSize, query.length - i, i + 1);
    return hits.map((e, i) => e / prevalence(i));
}