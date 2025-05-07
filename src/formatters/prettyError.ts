import util from 'node:util';
import {MAX_DEPTH} from '..';
import {bold, bgGreenBright, black, whiteBright, dim} from 'colorette';

/**
 * Recursively formats an Error and its causes in a vertical, readable form.
 * Includes custom fields and stack traces.
 */
export function prettyError(err: Error): string {

    const lines: string[] = [];
    let current: any = err;

    while (current instanceof Error) {

        // Print error header
        lines.push(bold(whiteBright(`${current.name}: ${current.message}`)));

        // Print stack trace (excluding the first line which is just the message)
        if (current.stack) {

            const stackLines = current.stack.split('\n').slice(1);

            for (const line of stackLines) {

                lines.push(dim(`  ${line.trim()}`));

            }

        }

        // Include all custom fields (excluding standard ones)
        const standard = new Set(['name', 'message', 'stack', 'cause']);
        const keys = Object.getOwnPropertyNames(current).filter((key) => !standard.has(key));

        for (const key of keys) {

            const val = (current as any)[key];

            lines.push(`${key}: ${util.inspect(val, {colors: true, depth: MAX_DEPTH})}`);

        }

        // Follow cause if it exists
        if (current.cause instanceof Error) {

            lines.push(black(bgGreenBright('↳ Caused by:')));
            current = current.cause;

        } else {

            break;

        }

    }

    return lines.join('\n');

}
