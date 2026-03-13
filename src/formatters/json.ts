import {LogEvent} from '../log';

// Syslog level → Lambda/CloudWatch-compatible string
// Uses numeric keys to avoid circular dependency with index.ts
const LEVEL_NAMES: Record<number, string> = {
    0: 'FATAL',
    1: 'FATAL',
    2: 'FATAL',
    3: 'ERROR',
    4: 'WARN',
    5: 'INFO',
    6: 'INFO',
    7: 'DEBUG',
};

export function formatJson(log: LogEvent): string {

    const output = {
        timestamp: new Date().toISOString(),
        level: LEVEL_NAMES[log.level] ?? 'INFO',
        message: log.message,
        ...(log.error && {error: log.error}),
        ...(log.data && {data: log.data}),
    };

    try {

        return JSON.stringify(output);

    } catch (error) {

        const safeLog = {
            timestamp: new Date().toISOString(),
            level: LEVEL_NAMES[log.level] ?? 'INFO',
            message: String(log.message || ''),
            error: '[Unserializable]',
            data: '[Unserializable]',
            _serializationError: 'Original log data could not be serialized',
        };

        try {

            return JSON.stringify(safeLog);

        } catch {

            console.error('jsout: JSON serialization failed:', error);

            return log.toString();

        }

    }

}
