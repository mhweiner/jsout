export function stripAnsiColors(output: string): string {

    return output
        // eslint-disable-next-line no-control-regex
        .replace(/\x1B\[[0-9;]*m/g, '') // strip ANSI colors
        .trim();

}
