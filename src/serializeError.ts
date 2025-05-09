/**
 * Recursively serializes an Error into a plain object,
 * preserving standard fields, cause chains, and custom properties.
 * Custom properties are depth-limited and circular-safe.
 */
export function serializeError(err: any, depth = 0, maxDepth = 10): any {

    if (!(err instanceof Error)) return err;

    const out: any = {
        name: err.name,
        message: err.message,
        stack: err.stack?.split('\n'),
    };

    const standardKeys = new Set(['name', 'message', 'stack', 'cause']);

    // Copy custom properties (e.g. `status`, `meta`, etc.)
    for (const key of Object.getOwnPropertyNames(err)) {

        if (!standardKeys.has(key)) {

            try {

                out[key] = safeRepr((err as any)[key], maxDepth - depth);

            } catch {

                out[key] = '[Unserializable]';

            }

        }

    }

    // Recursively serialize `cause` chain
    if ('cause' in err && err.cause instanceof Error && depth < maxDepth) {

        out.cause = serializeError(err.cause, depth + 1, maxDepth);

    }

    return out;

}

/**
 * Safely serializes an arbitrary value with depth and cycle protection.
 */
function safeRepr(value: any, maxDepth = 10): any {

    return limitDepth(value, 0, maxDepth, new WeakSet());

}

/**
 * Recursively limits object depth and detects circular references.
 * Returns '[Unserializable]' when depth or cycles are exceeded.
 */
function limitDepth(
    obj: any,
    currentDepth: number,
    maxDepth: number,
    seen: WeakSet<any>
): any {

    if (obj === null || typeof obj !== 'object') return obj;
    if (seen.has(obj)) return '[Unserializable]';
    seen.add(obj);

    if (currentDepth >= maxDepth) return '[Unserializable]';

    if (Array.isArray(obj)) {

        return obj.map((item) => {

            try {

                return limitDepth(item, currentDepth + 1, maxDepth, seen);

            } catch {

                return '[Unserializable]';

            }

        });

    }

    const result: Record<string, any> = {};

    for (const key of Object.getOwnPropertyNames(obj)) {

        try {

            result[key] = limitDepth(obj[key], currentDepth + 1, maxDepth, seen);

        } catch {

            result[key] = '[Unserializable]';

        }

    }

    return result;

}
