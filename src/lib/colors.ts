/* eslint-disable max-lines-per-function */
type ColorFunctions = {
    bold: (str: string) => string
    bgGreenBright: (str: string) => string
    black: (str: string) => string
    whiteBright: (str: string) => string
    gray: (str: string) => string
    white: (str: string) => string
    yellowBright: (str: string) => string
    redBright: (str: string) => string
    bgRedBright: (str: string) => string
};

// Complete ANSI color codes for future extensibility
const colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
};

/**
 * Portable color functions that work everywhere
 * Uses ANSI codes in terminal environments, no-op in non-terminal environments
 */
export function getColorFunctions(): ColorFunctions {

    // Check if we're in a terminal environment that supports colors
    const isTerminal = typeof process !== 'undefined'
                      && process.stdout
                      && process.stdout.isTTY
                      && process.env.TERM !== 'dumb';

    if (isTerminal) {

        // Terminal environment - use ANSI colors
        return {
            bold: (str: string) => `${colors.bold}${str}${colors.reset}`,
            bgGreenBright: (str: string) => `${colors.bgGreen}${str}${colors.reset}`,
            black: (str: string) => `${colors.reset}${str}${colors.reset}`,
            whiteBright: (str: string) => `${colors.white}${str}${colors.reset}`,
            gray: (str: string) => `${colors.gray}${str}${colors.reset}`,
            white: (str: string) => `${colors.white}${str}${colors.reset}`,
            yellowBright: (str: string) => `${colors.yellow}${str}${colors.reset}`,
            redBright: (str: string) => `${colors.red}${str}${colors.reset}`,
            bgRedBright: (str: string) => `${colors.bgRed}${str}${colors.reset}`,
        };

    } else {

        // Non-terminal environment (browser, etc.) - no colors
        const noop = (str: string): string => str;

        return {
            bold: noop,
            bgGreenBright: noop,
            black: noop,
            whiteBright: noop,
            gray: noop,
            white: noop,
            yellowBright: noop,
            redBright: noop,
            bgRedBright: noop,
        };

    }

}
