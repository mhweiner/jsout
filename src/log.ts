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

type ErrorFields = {
    name?: string
    message?: string
    stack?: string[]
    cause?: any
    data?: Record<string, any>
};

export function log(input: LogInput): void {

    // Validate inputs first - these should still throw
    if (!input) throw new Error('input is required');
    if (!input.options) throw new Error('options is required');

    const transports = input.transport ?? stdio;

    if (!transports.stdout) throw new Error('transport.stdout must be a function');
    if (!transports.stderr) throw new Error('transport.stderr must be a function');

    if (input.level > input.options.level) return;

    const errorFields = input.error ? getErrorFields(input.error) : {};
    const {name: errorName, message: errorMessage, stack, cause, data: errorData} = errorFields;
    const plainErrObj = removeUndefinedProps({name: errorName, message: errorMessage, stack, cause});
    const dataFields = {...serializeCustomProps(input.data), ...errorData};
    const message = input.message
        ?? ((errorName && errorMessage) ? `${errorName}: ${errorMessage}` : undefined)
        ?? ((errorName) ? `${errorName}` : undefined)
        ?? ((errorMessage) ? `${errorMessage}` : undefined)
        ?? '';

    const log: LogEvent = {
        level: input.level,
        message,
        error: Object.keys(plainErrObj).length > 0 ? plainErrObj : undefined,
        data: Object.keys(dataFields).length > 0 ? dataFields : undefined,
    };

    const transport = log.level <= LogLevel.warn
        ? transports.stderr // 0-4
        : transports.stdout; // 5-7

    input.options.format === LogFormat.json
        ? transport(formatJson(log))
        : transport(formatCli(log));

}

function removeUndefinedProps<T extends Record<string, any>>(obj: T): Partial<T> {

    const result: Partial<T> = {};

    for (const [key, value] of Object.entries(obj)) {

        if (value !== undefined) {

            result[key as keyof T] = value;

        }

    }
    return result;

}

function getErrorFields(error: any): ErrorFields {

    if (!error) return {};

    try {

        const serializedError = error instanceof Error
            ? serializeError(error)
            : typeof error === 'object'
                ? error
                : {};
        const serializedErrorObj: any = serializedError || error;
        const {name, message, stack, cause, ...data} = serializedErrorObj;
        const stackOrUndefined = stack?.length > 0 ? stack : undefined;
        const errorFields: ErrorFields = {name, message, stack: stackOrUndefined, cause, data};

        if (Object.keys(errorFields).length === 0) return {};

        return errorFields;

    } catch (e) {

        console.error('jsout: logging error:', e);

        return {};

    }

}

