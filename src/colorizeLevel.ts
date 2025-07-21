import {LogLevel} from '.';
import {getColorFunctions} from './lib/colors';

export function colorizeLevel(level: LogLevel): string {

    const {bold, gray, white, yellowBright, redBright, bgRedBright} = getColorFunctions();

    switch (level) {

        case LogLevel.debug:
            return bold(gray('DEBUG'));
        case LogLevel.info:
            return bold(white('INFO'));
        case LogLevel.notice:
            return bold(white('NOTICE'));
        case LogLevel.warn:
            return bold(yellowBright('WARN'));
        case LogLevel.error:
            return bold(redBright('ERROR'));
        case LogLevel.fatal:
            return bold(white(bgRedBright('FATAL')));
        case LogLevel.alert:
            return bold(white(bgRedBright('ALERT')));
        case LogLevel.emerg:
            return bold(white(bgRedBright('EMERG')));

    }

}
