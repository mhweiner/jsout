export const commonIgnorePatterns: RegExp[] = [
    // Node internals
    /node:internal\//,
    /^internal\//,
    /bootstrap_node\.js/,
    /module\.js/,
    /next_tick\.js/,
    /async_hooks\.js/,
    /processTicksAndRejections/,

    // TS helper filter
    /^\s*at\s+__awaiter\b/,
    /^\s*at\s+__generator\b/,

    // Specific Module internals
    /Module\._/,

    // Internal marker style: "__something__:line:col" with no slash
    /^__[^/]+:\d+:\d+/,
];

export function filterStackTrace(frames: string[], ignorePatterns: RegExp[] = commonIgnorePatterns): string[] {

    return frames.filter((line) => !ignorePatterns.some((pattern) => pattern.test(line)));

}
