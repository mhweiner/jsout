/**
 * Portable inspect function that mimics util.inspect behavior
 * Works in Node.js, Bun, and browser environments
 */
export function portableInspect(obj: any, options: {colors?: boolean, depth?: number | null} = {}): string {
    // Simple string representation for basic types
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (typeof obj === 'string') return `'${obj}'`;
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);

    // For objects and arrays, use a more compact format similar to util.inspect
    if (typeof obj === 'object') {
        try {
            // For simple objects, try to format them compactly like util.inspect
            if (Array.isArray(obj)) {
                if (obj.length === 0) return '[]';
                const items = obj.map((item) => portableInspect(item, options)).join(', ');
                return `[ ${items} ]`;
            } else {
                const keys = Object.keys(obj);
                if (keys.length === 0) return '{}';
                const pairs = keys.map((key) => `${key}: ${portableInspect(obj[key], options)}`);
                return `{ ${pairs.join(', ')} }`;
            }
        } catch {
            // Fallback for circular references or other issues
            return '[Object]';
        }
    }

    return String(obj);
}

/**
 * Portable color functions that fallback gracefully
 * Returns colorette functions in Node.js, no-op functions in other environments
 */
export function getColorFunctions() {
    try {
        // Try to import colorette (Node.js only)
        const {bold, bgGreenBright, black, whiteBright, gray, white, yellowBright, redBright, bgRedBright} = require('colorette');

        return {bold, bgGreenBright, black, whiteBright, gray, white, yellowBright, redBright, bgRedBright};
    } catch {
        // Fallback for non-Node environments
        const noop = (str: string) => str;

        return {
            bold: noop,
            bgGreenBright: noop,
            black: noop,
            whiteBright: noop,
            gray: noop,
            white: noop,
            yellowBright: noop,
            redBright: noop,
            bgRedBright: noop
        };
    }
} 