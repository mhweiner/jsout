import {test} from 'kizu';
import {formatJson} from './json';
import {LogEvent} from '../log';
import {LogLevel} from '..';
import {serializeError} from '../serializeError';

test('formats a basic log event with string level and timestamp', (assert) => {

    const err = new Error('Something went wrong');

    err.stack = 'Error: Something went wrong\n    at /path/to/file.js:1:1';

    const log: LogEvent = {
        level: LogLevel.notice,
        message: 'Something went wrong',
        error: serializeError(err),
        data: {foo: 'bar'},
    };

    const out = formatJson(log);
    const parsed = JSON.parse(out);

    assert.equal(parsed.level, 'INFO', 'notice maps to INFO');
    assert.equal(parsed.message, 'Something went wrong');
    assert.equal(parsed.error, {
        name: 'Error',
        message: 'Something went wrong',
        stack: ['/path/to/file.js:1:1'],
    });
    assert.equal(parsed.data, {foo: 'bar'});
    assert.equal(typeof parsed.timestamp, 'string', 'should include timestamp');
    assert.equal(/^\d{4}-\d{2}-\d{2}T/.test(parsed.timestamp), true, 'timestamp should be ISO 8601');

});

test('maps all log levels to correct string names', (assert) => {

    const levels: [LogLevel, string][] = [
        [LogLevel.emerg, 'FATAL'],
        [LogLevel.alert, 'FATAL'],
        [LogLevel.fatal, 'FATAL'],
        [LogLevel.error, 'ERROR'],
        [LogLevel.warn, 'WARN'],
        [LogLevel.notice, 'INFO'],
        [LogLevel.info, 'INFO'],
        [LogLevel.debug, 'DEBUG'],
    ];

    for (const [numLevel, expectedStr] of levels) {

        const log: LogEvent = {level: numLevel, message: 'test'};
        const parsed = JSON.parse(formatJson(log));

        assert.equal(parsed.level, expectedStr, `level ${numLevel} should map to ${expectedStr}`);

    }

});

test('omits error and data when not present', (assert) => {

    const log: LogEvent = {level: LogLevel.info, message: 'hello'};
    const parsed = JSON.parse(formatJson(log));

    assert.equal(parsed.error, undefined, 'error should not be present');
    assert.equal(parsed.data, undefined, 'data should not be present');
    assert.equal(parsed.level, 'INFO');
    assert.equal(parsed.message, 'hello');

});

test('handles JSON serialization errors gracefully', (assert) => {

    const problematicData = {};

    Object.defineProperty(problematicData, 'toJSON', {
        value: () => {

            throw new Error('JSON serialization failed');

        },
    });

    const log: LogEvent = {
        level: LogLevel.error,
        message: 'Test message',
        data: problematicData,
    };

    const out = formatJson(log);
    const parsed = JSON.parse(out);

    assert.equal(parsed.level, 'ERROR');
    assert.equal(parsed.message, 'Test message');
    assert.equal(parsed.data, '[Unserializable]');
    // eslint-disable-next-line no-underscore-dangle
    assert.equal(parsed._serializationError, 'Original log data could not be serialized');

});
