import {colorizeLevel} from '../colorizeLevel';
import {LogEvent} from '../log';
import util from 'node:util';
import {formatSerializedError, isSerializedError} from './formatSerializedError';
import {bold, white} from 'colorette';

export function formatCli(log: LogEvent): string {

    const insp = (obj: any): string => util.inspect(obj, {colors: true, depth: null});
    const level = `${bold(white('Level'))}: ${colorizeLevel(log.level)}\n`;
    const message = `${bold(white(`Message: ${log.message}`))}\n`;
    const error = cliFormatError(log.error);
    const data = log.data ? `${insp(log.data)}\n` : '';

    return `\n${level}${message}${error}${data}`;

}

function cliFormatError(error: any): string {

    if (!error) return '';
    if (isSerializedError(error)) {

        return `${formatSerializedError(error)}\n`;

    } else {

        return `${bold('Error')}: ${util.inspect(error, {colors: true, depth: null})}\n`;

    }

}
