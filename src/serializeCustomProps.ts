/* eslint-disable max-lines-per-function */
/**
 * Recursively extracts and serializes custom enumerable properties from an object.
 *
 * - Handles deeply nested structures with a configurable depth limit.
 * - Prevents circular references using a WeakSet.
 * - Skips functions and replaces unserializable values with a placeholder.
 * - Only serializes own, enumerable properties (e.g. custom fields on Error objects).
 *
 * @param obj - The object to extract custom properties from.
 * @param currentDepth - The current recursion depth (default: 0).
 * @param maxDepth - Maximum allowed depth (default: 7).
 * @param seen - Tracks previously visited objects to prevent cycles.
 * @returns A safe, shallow object with extracted properties, or a placeholder string.
 */
export function serializeCustomProps(
    obj: any,
    currentDepth: number = 0,
    maxDepth: number = 7,
    seen: WeakSet<any> = new WeakSet(),
): any {

    if (seen.has(obj)) return '[Unserializable]';
    if (typeof obj === 'function') return '[Unserializable]';
    if (currentDepth > maxDepth) return '[Unserializable]';
    if (typeof obj === 'number' && (Number.isNaN(obj) || !Number.isFinite(obj))) return '[Unserializable]';

    if (typeof obj === 'bigint') return obj.toString();
    if (typeof obj === 'symbol') return obj.toString();
    if (obj === null || obj === undefined) return obj;

    if (typeof obj !== 'object') return obj;

    seen.add(obj);

    if (Array.isArray(obj)) {

        try {

            return obj.map((item) => serializeCustomProps(item, currentDepth + 1, maxDepth, seen));

        } catch {

            return '[Unserializable]';

        }

    }

    const result: Record<string, any> = {};

    for (const key of Object.keys(obj)) {

        // Ignore keys that start with "_"
        if (key.startsWith('_')) continue;

        try {

            result[key] = serializeCustomProps(obj[key], currentDepth + 1, maxDepth, seen);

        } catch {

            result[key] = '[Unserializable]';

        }

    }

    return result;

}
