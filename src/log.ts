import {LogLevel, LogFormat} from '.';
import {Transport} from './transports';
import {formatCli} from './formatters/cli';
import {formatJson} from './formatters/json';

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

export function log(input: LogInput): void {

    if (!input) throw new Error('input is required');
    if (!input.options) throw new Error('options is required');
    if (!input.transport) throw new Error('transport is required');
    if (!input.transport.stdout) throw new Error('transport.stdout must be a function');
    if (!input.transport.stderr) throw new Error('transport.stderr must be a function');

    const {level, message, error, data, options} = input;

    if (level > options.level) return;

    const log: LogEvent = {
        level,
        message: message ?? (error as any)?.message ?? '',
        error,
        data,
    };

    const transport = log.level <= LogLevel.warn
        ? input.transport.stderr // 0-4
        : input.transport.stdout; // 5-7

    options.format === LogFormat.json
        ? transport(formatJson(log))
        : transport(formatCli(log));

}

