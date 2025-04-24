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
    crit = 2,
    err = 3, // Error condition. Requires attention.
    error = 3,
    warn = 4, // Possible issue that could root cause a bug. Attention advised. If not an issue, demote to info/debug.
    warning = 4,
    notice = 5, // Normal but significant condition. No action required.
    info = 6, // Detail on regular operation.
    debug = 7, // Anything else, i.e. too verbose to be included in "info" level. Not used in production.
}

/**
 * Set with process.env.LOG_FORMAT
 */
export enum LogFormat {
    json = 'json',
    human = 'human',
}

if (process.env.LOG && !LogLevel[process.env.LOG as keyof typeof LogLevel]) {

    throw new Error('process.env.LOG must be numeric value of [2, 7], or one of the following: crit, critical, fatal, err, error, warn, warning, notice, info, debug');

}

const options: CliOptions = {
    level: LogLevel[process.env.LOG as keyof typeof LogLevel] || LogLevel.info,
    format: process.env.LOG_FORMAT === LogFormat.human ? LogFormat.human : LogFormat.json,
};

export const logger = {
    emerg: (message?: string, error?: any, data?: any) => log({
        level: LogLevel.emerg, message, error, data, options, transport: stdio,
    }),
    alert: (message?: string, error?: any, data?: any) => log({
        level: LogLevel.alert, message, error, data, options, transport: stdio,
    }),
    crit: (message?: string, error?: any, data?: any) => log({
        level: LogLevel.crit, message, error, data, options, transport: stdio,
    }),
    critical: (message?: string, error?: any, data?: any) => log({
        level: LogLevel.crit, message, error, data, options, transport: stdio,
    }),
    fatal: (message?: string, error?: any, data?: any) => log({
        level: LogLevel.crit, message, error, data, options, transport: stdio,
    }),
    err: (message?: string, error?: any, data?: any) => log({
        level: LogLevel.err, message, error, data, options, transport: stdio,
    }),
    error: (message?: string, error?: any, data?: any) => log({
        level: LogLevel.err, message, error, data, options, transport: stdio,
    }),
    warn: (message?: string, error?: any, data?: any) => log({
        level: LogLevel.warn, message, error, data, options, transport: stdio,
    }),
    warning: (message?: string, error?: any, data?: any) => log({
        level: LogLevel.warn, message, error, data, options, transport: stdio,
    }),
    notice: (message?: string, data?: any) => log({
        level: LogLevel.notice, message, data, options, transport: stdio,
    }),
    info: (message?: string, data?: any) => log({
        level: LogLevel.info, message, data, options, transport: stdio,
    }),
    debug: (message?: string, data?: any) => log({
        level: LogLevel.debug, message, data, options, transport: stdio,
    }),
};

export * from './log';
export * from './fakeLoggerFactory';
