import {LogEvent} from '../log';
import {serializeError} from '../serializeError';

export function formatJson(log: LogEvent): string {

    log.error = log.error instanceof Error
        ? serializeError(log.error)
        : log.error;
    return JSON.stringify(log);

}
