import {colorizeLevel} from '../colorizeLevel';
import {LogEvent} from '../log';
import {formatSerializedError, isSerializedError} from './formatSerializedError';
import {inspect} from '../lib/inspect';
import {getColorFunctions} from '../lib/colors';

export function formatCli(log: LogEvent): string {

    const {bold, white} = getColorFunctions();

    const insp = (obj: any): string => inspect(obj);
    const level = `${bold(white('Level'))}: ${colorizeLevel(log.level)}\n`;
    const message = `${bold(white(`Message: ${log.message}`))}\n`;
    const error = cliFormatError(log.error);
    const data = log.data ? `${insp(log.data)}\n` : '';

    return `\n${level}${message}${error}${data}`;

}

function cliFormatError(error: any): string {

    const {bold} = getColorFunctions();

    if (!error) return '';
    if (isSerializedError(error)) {

        return `${formatSerializedError(error)}\n`;

    } else {

        return `${bold('Error')}: ${inspect(error)}\n`;

    }

}
