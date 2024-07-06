import {serializeError} from 'serialize-error';
import {LogLevel, LogFormat} from '.';
import util from 'node:util';
import {Transport} from './transports';
import {colorizeLevel} from './colorizeLevel';

export type LogInput = {
    level: LogLevel
    message?: string
    error?: {}
    data?: {}
    options: {
        level: LogLevel
        format: LogFormat
    }
    transport: Transport
};

export type LogEvent = {
    level: LogLevel
    message: string
    error?: {}
    data?: {}
};

export function log(input: LogInput) {

    if (!input) throw new Error('input is required');
    if (!input.options) throw new Error('options is required');
    if (!input.transport) throw new Error('transport is required');
    if (!input.transport.stdout) throw new Error('transport.stdout must be a function');
    if (!input.transport.stderr) throw new Error('transport.stderr must be a function');

    const {level, message, error, data, options} = input;

    if (level > options.level) return;

    const log: LogEvent = {
        level,
        message: message || getMessageFromError(error),
        error,
        data,
    };

    const transport = log.level <= LogLevel.warn
        ? input.transport.stderr // 0-4
        : input.transport.stdout; // 5-7

    options.format === LogFormat.json
        ? transport(stringify(log))
        : transport(humanFormat(log));

}

function humanFormat(log: LogEvent) {

    const insp = (obj: any) => util.inspect(obj, {colors: true, depth: null});
    const level = `Level: ${colorizeLevel(log.level)}\n`;
    const message = `Message: ${log.message}\n`;
    const error = log.error ? `${insp(log.error)}\n` : '';
    const data = log.data ? `${insp(log.data)}\n` : '';

    return `\n${level}${message}${error}${data}`;

}

function stringify(log: LogEvent) {

    log.error = log.error instanceof Error ? serializeError(log.error) : log.error;
    return JSON.stringify(log);

}

function getMessageFromError(error: any) {

    if (!error || !error.message) return '';

    return error.message as string;

}

