import {SerializedError} from '.';
import {serializeCustomProps} from './serializeCustomProps';

/**
 * Recursively serializes an Error into a plain object,
 * preserving standard fields, cause chains, and custom properties.
 * Custom properties are depth-limited and circular-safe.
 */
export function serializeError(err: Error, depth = 0, maxDepth = 7): SerializedError {

    // Seerialize standard Error properties
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
        .filter((line) => !isInternalFrame(line));

}

function isInternalFrame(line: string): boolean {

    return (
        line.includes('node:internal/')
        || line.startsWith('internal/')
        || line.includes('bootstrap_node.js')
        || line.includes('module.js')
        || line.includes('next_tick.js')
        || line.includes('timers.js')
        || line.includes('async_hooks.js')
        || line.includes('processTicksAndRejections')
        || line.includes('Generator.next')
        || line.includes('Module._')
        || line.includes('Object.<anonymous>')
        || line.startsWith('__')
    );

}
