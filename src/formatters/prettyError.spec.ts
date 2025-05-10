/* eslint-disable max-lines-per-function */
import {test} from 'hoare';
import {prettyError} from './prettyError';
import {normalizeLogOutput} from '../lib/normalizeLogOutput';
import {SerializedError} from '..';

test('prints a simple error with stack', (assert) => {

    const err: SerializedError = {
        name: 'Error',
        message: 'Something went wrong',
        stack: [
            'at Object.<anonymous> (/path/to/file.js:1:1)',
            'at Module._compile (node:internal/modules/cjs/loader:1210:14)',
            'at node:internal/modules/cjs/loader:1274:32',
        ],
    };
    const out = normalizeLogOutput(prettyError(err));

    assert.equal(out, [
        'Error: Something went wrong',
        '  [stack]',
    ].join('\n'));

});

test('prints custom fields on error', (assert) => {

    const err: SerializedError = {
        name: 'CustomError',
        message: 'Ooops',
        stack: [
            'at Object.<anonymous> (/path/to/file.js:1:1)',
            'at Module._compile (node:internal/modules/cjs/loader:1210:14)',
            'at node:internal/modules/cjs/loader:1274:32',
        ],
        code: 'E_FAIL',
        meta: {id: 123},
    };
    const out = normalizeLogOutput(prettyError(err));

    assert.equal(out, [
        'CustomError: Ooops',
        '  [stack]',
        'code: \'E_FAIL\'',
        'meta: { id: 123 }',
    ].join('\n'));

});

test('prints cause chain in flat format', (assert) => {

    const foo: SerializedError = {
        name: 'Error',
        message: 'Foo',
        stack: [
            'at Object.<anonymous> (/path/to/file.js:1:1)',
            'at Module._compile (node:internal/modules/cjs/loader:1210:14)',
            'at node:internal/modules/cjs/loader:1274:32',
        ],
    };
    const bar: SerializedError = {
        name: 'Error',
        message: 'Bar',
        stack: [
            'at Object.<anonymous> (/path/to/file.js:1:1)',
            'at Module._compile (node:internal/modules/cjs/loader:1210:14)',
            'at node:internal/modules/cjs/loader:1274:32',
        ],
    };
    const baz: SerializedError = {
        name: 'Error',
        message: 'Baz',
        stack: [
            'at Object.<anonymous> (/path/to/file.js:1:1)',
            'at Module._compile (node:internal/modules/cjs/loader:1210:14)',
            'at node:internal/modules/cjs/loader:1274:32',
        ],
    };

    // Chain them together
    foo.cause = bar;
    bar.cause = baz;

    const out = normalizeLogOutput(prettyError(foo));

    assert.equal(out, [
        'Error: Foo',
        '  [stack]',
        '↳ Caused by:',
        'Error: Bar',
        '  [stack]',
        '↳ Caused by:',
        'Error: Baz',
        '  [stack]',
    ].join('\n'));

});
