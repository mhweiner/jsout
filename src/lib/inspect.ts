/* eslint-disable max-lines-per-function */
import {getColorFunctions} from './colors';

/**
 * Portable inspect function that mimics util.inspect behavior
 * Works in Node.js, Bun, and browser environments
 * Always uses colors and proper formatting when supported
 */
export function inspect(obj: any, currentDepth: number = 0): string {

    const colorFunctions = getColorFunctions();

    // Simple string representation for basic types
    if (obj === null) {

        return colorFunctions.gray('null');

    }
    if (obj === undefined) {

        return colorFunctions.gray('undefined');

    }
    if (typeof obj === 'string') {

        const quoted = `'${obj}'`;

        return colorFunctions.yellowBright(quoted);

    }
    if (typeof obj === 'number') {

        const numStr = String(obj);

        return colorFunctions.whiteBright(numStr);

    }
    if (typeof obj === 'boolean') {

        const boolStr = String(obj);

        return colorFunctions.redBright(boolStr);

    }
    if (typeof obj === 'function') {

        const funcStr = `[Function: ${obj.name || 'anonymous'}]`;

        return colorFunctions.gray(funcStr);

    }
    if (typeof obj === 'symbol') {

        const symStr = obj.toString();

        return colorFunctions.gray(symStr);

    }

    // For objects and arrays, use a more compact format similar to util.inspect
    if (typeof obj === 'object') {

        try {

            // For arrays
            if (Array.isArray(obj)) {

                if (obj.length === 0) {

                    return colorFunctions.gray('[]');

                }

                const items = obj.map((item) => inspect(item, currentDepth + 1)).join(', ');

                return `[ ${items} ]`;

            } else {

                // For objects
                const keys = Object.keys(obj);

                if (keys.length === 0) {

                    return colorFunctions.gray('{}');

                }

                const pairs = keys.map((key) => {

                    const keyStr = colorFunctions.bold(key);
                    const valueStr = inspect(obj[key], currentDepth + 1);

                    return `${keyStr}: ${valueStr}`;

                });

                return `{ ${pairs.join(', ')} }`;

            }

        } catch {

            // Fallback for circular references or other issues
            return colorFunctions.gray('[Object]');

        }

    }

    return String(obj);

}
