/* eslint-disable max-lines-per-function */
import {test} from 'kizu';
import {formatSerializedError} from './formatSerializedError';
import {SerializedError} from '..';
import {stripAnsiColors} from '../lib/stripAnsiColors';

test('prints a simple error with stack', (assert) => {

    const err: SerializedError = {
        name: 'Error',
        message: 'Something went wrong',
        stack: [
            'Error: Something went wrong',
            'Object.<anonymous> (/path/to/file.js:1:1)',
            'Module._compile (node:internal/modules/cjs/loader:1210:14)',
            'node:internal/modules/cjs/loader:1274:32',
        ],
    };
    const out = stripAnsiColors(formatSerializedError(err));

    assert.equal(out, [
        'Error: Something went wrong',
        '  at Object.<anonymous> (/path/to/file.js:1:1)',
        '  at Module._compile (node:internal/modules/cjs/loader:1210:14)',
        '  at node:internal/modules/cjs/loader:1274:32',
    ].join('\n'));

});

test('prints custom fields on error', (assert) => {

    const err: SerializedError = {
        name: 'CustomError',
        message: 'Ooops',
        stack: [
            'CustomError: Ooops',
            'Object.<anonymous> (/path/to/file.js:1:1)',
            'Module._compile (node:internal/modules/cjs/loader:1210:14)',
            'node:internal/modules/cjs/loader:1274:32',
        ],
        code: 'E_FAIL',
        meta: {id: 123},
    };
    const out = stripAnsiColors(formatSerializedError(err));

    assert.equal(out, [
        'CustomError: Ooops',
        '  at Object.<anonymous> (/path/to/file.js:1:1)',
        '  at Module._compile (node:internal/modules/cjs/loader:1210:14)',
        '  at node:internal/modules/cjs/loader:1274:32',
        'code: \'E_FAIL\'',
        'meta: { id: 123 }',
    ].join('\n'));

});

test('prints cause chain in flat format', (assert) => {

    const foo: SerializedError = {
        name: 'Error',
        message: 'Foo',
        stack: [
            'Error: Foo',
            '/app/src/foo.ts:1:1',
        ],
    };
    const bar: SerializedError = {
        name: 'Error',
        message: 'Bar',
        stack: [
            'Error: Bar',
            '/app/src/bar.ts:1:1',
        ],
    };
    const baz: SerializedError = {
        name: 'Error',
        message: 'Baz',
        stack: [
            'Error: Baz',
            '/app/src/baz.ts:1:1',
        ],
    };

    // Chain them together
    foo.cause = bar;
    bar.cause = baz;

    const out = stripAnsiColors(formatSerializedError(foo));

    assert.equal(out, [
        'Error: Foo',
        '  at /app/src/foo.ts:1:1',
        '↳ Caused by:',
        'Error: Bar',
        '  at /app/src/bar.ts:1:1',
        '↳ Caused by:',
        'Error: Baz',
        '  at /app/src/baz.ts:1:1',
    ].join('\n'));

});
