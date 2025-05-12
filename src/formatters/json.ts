import {LogEvent} from '../log';

export function formatJson(log: LogEvent): string {

    return JSON.stringify(log);

}
