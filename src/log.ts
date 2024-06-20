import {ErrorLevel, Log, Options} from '.';
import {output} from './output';

function getErrorMessage(error: any) {

    if (!error || !error.message) return '';

    return error.message as string;

}

export function log(input: {
    level: ErrorLevel
    message?: string
    error?: {}
    data?: {}
    options: Options
}) {

    const {level, message, error, data, options} = input;

    if (options.level > level) return;

    const log: Log = {
        level,
        message: message || getErrorMessage(error),
        error,
        data,
    };

    return output(log, options);

}

