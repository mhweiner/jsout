import {MAX_DEPTH} from '..';
import {colorizeLevel} from '../colorizeLevel';
import {LogEvent} from '../log';
import util from 'node:util';
import {prettyError} from './prettyError';
import {bold, white} from 'colorette';
import {serializeError} from '../serializeError';

export function formatCli(log: LogEvent): string {

    const insp = (obj: any): string => util.inspect(obj, {colors: true, depth: MAX_DEPTH});
    const level = `${bold(white('Level'))}: ${colorizeLevel(log.level)}\n`;
    const message = `${bold(white(`Message: ${log.message}`))}\n`;
    const error = cliFormatError(log.error);
    const data = log.data ? `${insp(log.data)}\n` : '';

    return `\n${level}${message}${error}${data}`;

}

function cliFormatError(error: any): string {

    if (!error) return '';
    if (error instanceof Error) return prettyError(serializeError(error));
    if (typeof error === 'string') return error;
    if (typeof error === 'object') return util.inspect(error, {colors: true, depth: MAX_DEPTH});

    return String(error);

}
