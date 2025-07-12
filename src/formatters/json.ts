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
            _serializationError: 'Original log data could not be serialized'
        };
        
        try {
            return JSON.stringify(safeLog);
        } catch {
            // Last resort - return a minimal safe string
            return JSON.stringify({
                level: log.level,
                message: 'Log serialization failed',
                _error: 'JSON serialization failed completely'
            });
        }
    }

}
