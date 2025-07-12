import {test} from 'hoare';
import {formatJson} from './json';
import {LogEvent} from '../log';
import {serializeError} from '../serializeError';

test('formats a basic log event', (assert) => {

    const err = new Error('Something went wrong');

    // replace stack with fake stack
    err.stack = 'Error: Something went wrong\n    at /path/to/file.js:1:1';

    const log: LogEvent = {
        level: 5,
        message: 'Something went wrong',
        error: serializeError(err),
        data: {foo: 'bar'},
    };

    const out = formatJson(log);

    assert.equal(JSON.parse(out), {
        level: 5,
        message: 'Something went wrong',
        error: {
            name: 'Error',
            message: 'Something went wrong',
            stack: ['/path/to/file.js:1:1'],
        },
        data: {foo: 'bar'},
    });

});

test('handles JSON serialization errors gracefully', (assert) => {

    // Create a log event with problematic data that would cause JSON.stringify to fail
    const problematicData = {};

    Object.defineProperty(problematicData, 'toJSON', {
        value: () => {

            throw new Error('JSON serialization failed');

        },
    });

    const log: LogEvent = {
        level: 3,
        message: 'Test message',
        data: problematicData,
    };

    const out = formatJson(log);

    // Should return a safe fallback JSON string
    const parsed = JSON.parse(out);

    assert.equal(parsed.level, 3);
    assert.equal(parsed.message, 'Test message');
    assert.equal(parsed.data, '[Unserializable]');
    // eslint-disable-next-line no-underscore-dangle
    assert.equal(parsed._serializationError, 'Original log data could not be serialized');

});
