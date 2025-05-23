import {log} from './log';
import {stdio} from './transports';

export type CliOptions = {
    level: LogLevel
    format: LogFormat
};

export enum LogLevel {
    emerg = 0, // System is unusable. (Not for application use)
    alert = 1, // Action must be taken immediately  (Not for application use)
    fatal = 2, // The service is going to stop or become unusable. Unrecoverable error. Immediate attention required.
    critical = 2,
    error = 3, // Error condition. Requires attention.
    warn = 4, // Possible issue that could root cause a bug. Attention advised. If not an issue, demote to info/debug.
    notice = 5, // Normal but significant condition. No action required.
    info = 6, // Detail on regular operation.
    debug = 7, // Anything else, i.e. too verbose to be included in "info" level. Not used in production.
}

export type SerializedError = {
    name: string
    message: string
    stack: string[]
    cause?: SerializedError
    [key: string]: any
};

/**
 * Set with process.env.LOG_FORMAT
 */
export enum LogFormat {
    json = 'json',
    cli = 'cli',
    human = 'cli', // deprecated
}

if (process.env.LOG && !LogLevel[process.env.LOG as keyof typeof LogLevel]) {

    throw new Error('process.env.LOG must be numeric value of [2, 7], or one of the following: crit, critical, fatal, err, error, warn, warning, notice, info, debug');

}

const options: CliOptions = {
    level: LogLevel[process.env.LOG as keyof typeof LogLevel] || LogLevel.info,
    format: process.env.LOG_FORMAT === LogFormat.human ? LogFormat.human : LogFormat.json,
};
const transport = stdio; // For now, we only have stdio transport

export const logger = {
    emerg: (message?: string, error?: any, data?: any): void => log({
        level: LogLevel.emerg, message, error, data, options, transport,
    }),
    alert: (message?: string, error?: any, data?: any): void => log({
        level: LogLevel.alert, message, error, data, options, transport,
    }),
    critical: (message?: string, error?: any, data?: any): void => log({
        level: LogLevel.critical, message, error, data, options, transport,
    }),
    fatal: (message?: string, error?: any, data?: any): void => log({
        level: LogLevel.critical, message, error, data, options, transport,
    }),
    error: (message?: string, error?: any, data?: any): void => log({
        level: LogLevel.error, message, error, data, options, transport,
    }),
    warn: (message?: string, error?: any, data?: any): void => log({
        level: LogLevel.warn, message, error, data, options, transport,
    }),
    notice: (message?: string, data?: any): void => log({
        level: LogLevel.notice, message, data, options, transport,
    }),
    info: (message?: string, data?: any): void => log({
        level: LogLevel.info, message, data, options, transport,
    }),
    debug: (message?: string, data?: any): void => log({
        level: LogLevel.debug, message, data, options, transport,
    }),
};

export * from './log';
export * from './mockLoggerFactory';
