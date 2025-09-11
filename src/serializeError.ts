import {SerializedError} from '.';
import {commonIgnorePatterns} from './filterStackTrace';
import {serializeCustomProps} from './serializeCustomProps';

/**
 * Recursively serializes an Error into a plain object,
 * preserving standard fields, cause chains, and custom properties.
 * Custom properties are depth-limited and circular-safe.
 */
export function serializeError(err: Error, depth = 0, maxDepth = 7): SerializedError {

    // Serialize standard Error properties
    const out: any = {
        name: err.name,
        message: err.message,
        stack: extractStack(err.stack ?? ''),
    };

    // Serialize custom properties
    Object.assign(out, serializeCustomProps(err, depth, maxDepth));

    // Recursively serialize `cause` chain
    if ('cause' in err && err.cause instanceof Error && depth < maxDepth) {

        out.cause = serializeError(err.cause, depth + 1, maxDepth);

    }

    return out;

}

function extractStack(stack: string): string[] {

    return stack
        .split('\n')
        .slice(1)
        .map((line) => line.replace(/^\s*at\s+/, ''))
        .filter((line) => !commonIgnorePatterns.some((pattern) => pattern.test(line)));

}
