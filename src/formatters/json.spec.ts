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
