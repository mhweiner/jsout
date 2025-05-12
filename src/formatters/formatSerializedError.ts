import util from 'node:util';
import {SerializedError} from '..';
import {bold, bgGreenBright, black, whiteBright, gray} from 'colorette';

/**
 * Formats a serialized error (from serializeError) into human-readable text.
 */
export function formatSerializedError(err: SerializedError): string {

    const lines: string[] = [];
    let current: SerializedError | undefined = err;

    while (current) {

        // Header
        lines.push(bold(whiteBright(`${current.name}: ${current.message}`)));

        // Stack trace
        for (const line of current.stack.slice(1)) {

            lines.push(gray(`  at ${line.trim()}`));

        }

        // Custom fields
        for (const key of Object.keys(current)) {

            // Skip standard fields
            if (key === 'name' || key === 'message' || key === 'stack' || key === 'cause') continue;

            lines.push(`${key}: ${util.inspect(current[key], {colors: true, depth: null})}`);

        }

        // Cause chain
        if (current.cause) {

            lines.push(black(bgGreenBright('↳ Caused by:')));

        }

        current = current.cause;

    }

    return lines.join('\n');

}

export function isSerializedError(obj: any): obj is SerializedError {

    return obj
        && !(obj instanceof Error)
        && typeof obj === 'object'
        && 'message' in obj
        && 'stack' in obj
        && Array.isArray(obj.stack);

}
