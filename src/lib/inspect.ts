/**
 * Portable inspect function that uses Node's util.inspect when available
 * Falls back to console.log for non-Node environments
 */
export function inspect(obj: any): string {

    // Try to use Node's util.inspect if available
    try {

        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        const util = require('util');

        if (util && typeof util.inspect === 'function') {

            return util.inspect(obj, {colors: true, depth: null, compact: false});

        }

    } catch {
        // util not available, fall back to console.log
    }

    // Fallback: use console.log and capture output
    try {

        const originalLog = console.log;
        let output = '';

        console.log = (...args: any[]): void => {

            output = args.map((arg) => String(arg)).join(' ');

        };
        console.log(obj);
        console.log = originalLog;
        return output;

    } catch {

        // Last resort: simple string conversion
        return String(obj);

    }

}
