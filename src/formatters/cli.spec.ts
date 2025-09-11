/* eslint-disable max-lines-per-function */
import {test} from 'kizu';
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

    assert.equal(out, 'Level: ERROR\n'
  + 'Message: A custom message\n'
  + 'OuterError: Outer error\n'
  + '  at /app/src/foo.ts:1:1\n'
  + 'foo: \'bar\'\n'
  + '↳ Caused by:\n'
  + 'InnerError: Inner error\n'
  + '  at /app/src/bar.ts:1:1\n'
  + 'innerFoo: \'innerBar\'\n'
  + '{\n'
  + '  baz: \'bop\'\n'
  + '}');

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

    assert.equal(out, 'Level: ALERT\n'
  + 'Message: A custom message\n'
  + 'Error: {\n'
  + '  message: \'Outer error\',\n'
  + '  foo: \'bar\'\n'
  + '}\n'
  + '{\n'
  + '  baz: \'bop\'\n'
  + '}');

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
