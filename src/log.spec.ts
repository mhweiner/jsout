/* eslint-disable max-lines-per-function */
import {test} from 'kizu';
import {LogLevel, LogFormat} from '.';
import {log} from './log';
import {stub} from 'cjs-mock';
import {stripAnsiColors} from './lib/stripAnsiColors';

test('logs debug to stdout in json format', (assert) => {

    const stderrStub = stub();
    const stdoutStub = stub();

    log({
        level: LogLevel.debug,
        options: {
            level: LogLevel.debug,
            format: LogFormat.json,
        },
        transport: {
            stdout: stdoutStub,
            stderr: stderrStub,
        },
        message: 'hello world',
        data: {data: 'data'},
    });

    // then
    assert.equal(
        stdoutStub.getCalls()[0][0],
        JSON.stringify({
            level: LogLevel.debug,
            message: 'hello world',
            data: {data: 'data'},
        }),
    );

});

test('logs json info to stdout in cli format', (assert) => {

    const stderrStub = stub();
    const stdoutStub = stub();

    log({
        level: LogLevel.info,
        options: {
            level: LogLevel.info,
            format: LogFormat.cli,
        },
        transport: {
            stdout: stdoutStub,
            stderr: stderrStub,
        },
        data: {data: 'data'},
        message: 'hello world',
    });

    assert.equal(
        stripAnsiColors(stdoutStub.getCalls()[0][0]),
        'Level: INFO\n'
        + 'Message: hello world\n'
        + '{ data: \'data\' }',
    );

});

test('log levels higher than options.level are ignored', (assert) => {

    const stderrStub = stub();
    const stdoutStub = stub();

    log({
        level: LogLevel.debug,
        options: {
            level: LogLevel.info,
            format: LogFormat.json,
        },
        transport: {
            stdout: stdoutStub,
            stderr: stderrStub,
        },
        message: 'hello world',
    });

    assert.equal(stdoutStub.getCalls().length, 0, 'stdout should not be called');
    assert.equal(stderrStub.getCalls().length, 0, 'stderr should not be called');

});

test('log levels <= 4 are sent to stderr', (assert) => {

    const stderrStub = stub();
    const stdoutStub = stub();

    const fakeErr = new Error('my b');

    // replace stack with fake stack
    fakeErr.stack = 'Error: my b\n  at foo.ts:1:1';

    log({
        level: LogLevel.error,
        options: {
            level: LogLevel.info,
            format: LogFormat.json,
        },
        transport: {
            stdout: stdoutStub,
            stderr: stderrStub,
        },
        error: fakeErr,
    });

    assert.equal(stdoutStub.getCalls().length, 0, 'stdout should not be called');
    assert.equal(
        stderrStub.getCalls()[0][0],
        JSON.stringify({
            level: LogLevel.error,
            message: 'my b',
            error: {
                name: 'Error',
                message: 'my b',
                stack: ['foo.ts:1:1'],
            },
        }),
        'stderr should be called, message should be inferred from error, err should be serialized'
    );

});

test('missing inputs should throw errors', (assert) => {

    // @ts-ignore
    assert.throws(() => log(undefined), new Error('input is required'));
    // @ts-ignore
    assert.throws(() => log({}), new Error('options is required'));
    // @ts-ignore
    assert.throws(() => log({options: {}, transport: {}}), new Error('transport.stdout must be a function'));
    // @ts-ignore
    assert.throws(() => log({options: {}, transport: {stdout: () => {}}}), new Error('transport.stderr must be a function'));

});

test('logs with no message inherit from error object', (assert) => {

    const stderrStub = stub();
    const stdoutStub = stub();

    const fakeErr = new Error('my b');

    // replace stack with fake stack
    fakeErr.stack = 'Error: my b\n  at foo.ts:1:1';

    log({
        level: LogLevel.error,
        options: {
            level: LogLevel.info,
            format: LogFormat.json,
        },
        transport: {
            stdout: stdoutStub,
            stderr: stderrStub,
        },
        error: fakeErr,
    });

    assert.equal(
        stderrStub.getCalls()[0][0],
        JSON.stringify({
            level: LogLevel.error,
            message: 'my b',
            error: {
                name: 'Error',
                message: 'my b',
                stack: ['foo.ts:1:1'],
            },
        })
    );

});

test('logs with message retain messge given, not message from error object', (assert) => {

    const stderrStub = stub();
    const stdoutStub = stub();

    const fakeErr = new Error('my b');

    // replace stack with fake stack
    fakeErr.stack = 'Error: my b\n  at foo.ts:1:1';

    log({
        level: LogLevel.error,
        options: {
            level: LogLevel.info,
            format: LogFormat.json,
        },
        transport: {
            stdout: stdoutStub,
            stderr: stderrStub,
        },
        error: fakeErr,
        message: 'user-supplied message',
    });

    assert.equal(
        stderrStub.getCalls()[0][0],
        JSON.stringify({
            level: LogLevel.error,
            message: 'user-supplied message',
            error: {
                name: 'Error',
                message: 'my b',
                stack: ['foo.ts:1:1'],
            },
        })
    );

});

test('logs with no message and no error.message return empty string as message', (assert) => {

    const stderrStub = stub();
    const stdoutStub = stub();

    log({
        level: LogLevel.error,
        options: {
            level: LogLevel.info,
            format: LogFormat.json,
        },
        transport: {
            stdout: stdoutStub,
            stderr: stderrStub,
        },
        error: {name: 'Error'},
    });

    assert.equal(
        stderrStub.getCalls()[0][0],
        JSON.stringify({
            level: LogLevel.error,
            message: '',
            error: {
                name: 'Error',
            },
        })
    );

});

test('accepts objects as error, but they are not serialized as errors', (assert) => {

    const stderrStub = stub();
    const stdoutStub = stub();

    log({
        level: LogLevel.error,
        options: {
            level: LogLevel.info,
            format: LogFormat.json,
        },
        transport: {
            stdout: stdoutStub,
            stderr: stderrStub,
        },
        error: {
            name: 'Error',
            message: 'my b',
            stack: 'Error: my b\n  at foo.ts:1:1',
        },
    });

    assert.equal(
        stderrStub.getCalls()[0][0],
        JSON.stringify({
            level: LogLevel.error,
            message: 'my b',
            error: {
                name: 'Error',
                message: 'my b',
                stack: 'Error: my b\n  at foo.ts:1:1',
            },
        })
    );

});
