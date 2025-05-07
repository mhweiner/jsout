/**
 * Normalizes the output of an error message for testing purposes.
 * - Strips ANSI colors
 * - Collapses stack traces into a single line
 * - Trims leading and trailing whitespace
 */
export function normalizeLogOutput(output: string): string {

    return output
        // eslint-disable-next-line no-control-regex
        .replace(/\x1B\[[0-9;]*m/g, '') // strip ANSI colors
        .replace(/(?:^ {2}at .+\n?)+/gm, '  [stack]\n') // collapse per block
        .trim();

}
