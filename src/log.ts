/* eslint-disable max-lines-per-function */
import {LogLevel, LogFormat} from '.';
import {stdio, Transport} from './transports';
import {formatCli} from './formatters/cli';
import {formatJson} from './formatters/json';
import {serializeCustomProps} from './serializeCustomProps';
import {serializeError} from './serializeError';

export type LogInput = {
    level: LogLevel
    message?: string
    error?: {}
    data?: {}
    options: {
        level: LogLevel
        format: LogFormat
    }
    transport?: Transport
};

export type LogEvent = {
    level: LogLevel
    message: string
    error?: {}
    data?: {}
};

function getTransport(transports: Transport, level: LogLevel): (msg: string) => void {

    if (level <= LogLevel.error) return transports.error;
    if (level <= LogLevel.warn) return transports.warn;
    if (level <= LogLevel.info) return transports.info;
    return transports.debug;

}

export function log(input: LogInput): void {

    // Validate inputs first - these should still throw
    if (!input) throw new Error('input is required');
    if (!input.options) throw new Error('options is required');

    const transports = input.transport ?? stdio;

    if (!transports.error) throw new Error('transport.error must be a function');
    if (!transports.warn) throw new Error('transport.warn must be a function');
    if (!transports.info) throw new Error('transport.info must be a function');
    if (!transports.debug) throw new Error('transport.debug must be a function');

    const {level, message, error, data, options} = input;

    if (level > options.level) return;

    try {

        const log: LogEvent = {
            level,
            message: message ?? (error as any)?.message ?? '',
            error: error instanceof Error
                ? serializeError(error)
                : serializeCustomProps(error),
            data: serializeCustomProps(data),
        };

        const transport = getTransport(transports, log.level);

        options.format === LogFormat.json
            ? transport(formatJson(log))
            : transport(formatCli(log));

    } catch (logError) {

        console.error('jsout: logging error:', logError);

    }

}

