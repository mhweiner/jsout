import {LogEvent} from '../log';

export function formatJson(log: LogEvent): string {

    try {

        return JSON.stringify(log);

    } catch (error) {

        // If JSON.stringify fails, create a safe fallback
        const safeLog = {
            level: log.level,
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
