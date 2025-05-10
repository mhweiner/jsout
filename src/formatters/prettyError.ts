import util from 'node:util';
import {MAX_DEPTH, SerializedError} from '..';
import {bold, bgGreenBright, black, whiteBright, dim} from 'colorette';

/**
 * Formats a serialized error (from serializeError) into human-readable text.
 */
export function prettyError(err: SerializedError): string {

    const lines: string[] = [];
    let current: SerializedError | undefined = err;

    while (current) {

        // Header
        lines.push(bold(whiteBright(`${current.name}: ${current.message}`)));

        // Stack trace
        if (Array.isArray(current.stack)) {

            for (const line of current.stack.slice(1)) {

                lines.push(dim(`  ${line.trim()}`));

            }

        }

        // Custom fields
        const standard = new Set(['name', 'message', 'stack', 'cause']);

        for (const key of Object.keys(current)) {

            if (!standard.has(key)) {

                lines.push(`${key}: ${util.inspect(current[key], {colors: true, depth: MAX_DEPTH})}`);

            }

        }

        // Cause chain
        if (current.cause) {

            lines.push(black(bgGreenBright('↳ Caused by:')));

        }

        current = current.cause;

    }

    return lines.join('\n');

}
