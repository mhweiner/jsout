/* eslint-disable max-lines-per-function */
import {test} from 'hoare';
import {formatCli} from './cli';
import {SerializedError} from '..';
import {stripAnsiColors} from '../lib/stripAnsiColors';

test('formatCli: SerializedError', (assert) => {

    const err: SerializedError = {
        name: 'OuterError',
        message: 'Outer error',
        stack: [
            'Error: Outer error',
            '/app/src/foo.ts:1:1',
        ],
        cause: {
            name: 'InnerError',
            message: 'Inner error',
            stack: [
                'Error: Inner error',
                '/app/src/bar.ts:1:1',
            ],
            innerFoo: 'innerBar',
        },
        foo: 'bar',
    };
    const log = {
        level: 3,
        message: 'A custom message',
        error: err,
        data: {baz: 'bop'},
    };
    const out = stripAnsiColors(formatCli(log));

    assert.equal(out, [
        'Level: ERROR',
        'Message: A custom message',
        'OuterError: Outer error',
        '  at /app/src/foo.ts:1:1',
        'foo: \'bar\'',
        '↳ Caused by:',
        'InnerError: Inner error',
        '  at /app/src/bar.ts:1:1',
        'innerFoo: \'innerBar\'',
        '{ baz: \'bop\' }',
    ].join('\n'));

});

test('formatCli: POJO error', (assert) => {

    const err = {
        message: 'Outer error',
        foo: 'bar',
    };
    const log = {
        level: 1,
        message: 'A custom message',
        error: err,
        data: {baz: 'bop'},
    };
    const out = stripAnsiColors(formatCli(log));

    assert.equal(out, [
        'Level: ALERT',
        'Message: A custom message',
        'Error: { message: \'Outer error\', foo: \'bar\' }',
        '{ baz: \'bop\' }',
    ].join('\n'));

});

test('formatCli: omits data block if no data', (assert) => {

    const err: SerializedError = {
        name: 'Error',
        message: 'my b',
        stack: [
            'Error: by b',
            '/app/src/foo.ts:1:1',
        ],
    };
    const log = {
        level: 3,
        message: 'A custom message',
        error: err,
    };
    const out = stripAnsiColors(formatCli(log));

    assert.equal(out, [
        'Level: ERROR',
        'Message: A custom message',
        'Error: my b',
        '  at /app/src/foo.ts:1:1',
    ].join('\n'));

});
