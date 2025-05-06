import kleur from 'kleur';
import {LogLevel} from '.';

export function colorizeLevel(level: LogLevel): string {

    switch (level) {

        case LogLevel.debug:
            return kleur.bold().grey('DEBUG');
        case LogLevel.info:
            return kleur.bold().white('INFO');
        case LogLevel.notice:
            return kleur.bold().white('NOTICE');
        case LogLevel.warn:
            return kleur.bold().yellow('WARN');
        case LogLevel.error:
            return kleur.bold().red('ERROR');
        case LogLevel.fatal:
            return kleur.bold().white().bgRed('FATAL');
        case LogLevel.alert:
            return kleur.bold().white().bgRed('ALERT');
        case LogLevel.emerg:
            return kleur.bold().white().bgRed('EMERG');

    }

}
