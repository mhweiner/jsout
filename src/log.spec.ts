/* eslint-disable max-lines-per-function */
import {test} from 'kizu';
import {LogLevel, LogFormat} from '.';
import {log} from './log';
import {stub} from 'cjs-mock';
import {stripAnsiColors} from './lib/stripAnsiColors';
import {Transport} from './transports';

function createTransportStubs(): {transport: Transport, stubs: Record<keyof Transport, ReturnType<typeof stub>>} {

    const stubs = {
        error: stub(),
        warn: stub(),
        info: stub(),
        debug: stub(),
    };

    return {transport: stubs, stubs};

}

test('logs debug to debug transport in json format', (assert) => {

    const {transport, stubs} = createTransportStubs();

    log({
        level: LogLevel.debug,
        options: {
            level: LogLevel.debug,
            format: LogFormat.json,
        },
        transport,
        message: 'hello world',
        data: {data: 'data'},
    });

    assert.equal(
        stubs.debug.getCalls()[0][0],
        JSON.stringify({
            level: LogLevel.debug,
            message: 'hello world',
            data: {data: 'data'},
        }),
    );
    assert.equal(stubs.error.getCalls().length, 0, 'error should not be called');
    assert.equal(stubs.warn.getCalls().length, 0, 'warn should not be called');
    assert.equal(stubs.info.getCalls().length, 0, 'info should not be called');

});

test('logs info to info transport in cli format', (assert) => {

    const {transport, stubs} = createTransportStubs();

    log({
        level: LogLevel.info,
        options: {
            level: LogLevel.info,
            format: LogFormat.cli,
        },
        transport,
        data: {data: 'data'},
        message: 'hello world',
    });

    assert.equal(
        stripAnsiColors(stubs.info.getCalls()[0][0]),
        'Level: INFO\n'
        + 'Message: hello world\n'
        + '{ data: \'data\' }',
    );
    assert.equal(stubs.error.getCalls().length, 0, 'error should not be called');
    assert.equal(stubs.warn.getCalls().length, 0, 'warn should not be called');
    assert.equal(stubs.debug.getCalls().length, 0, 'debug should not be called');

});

test('log levels higher than options.level are ignored', (assert) => {

    const {transport, stubs} = createTransportStubs();

    log({
        level: LogLevel.debug,
        options: {
            level: LogLevel.info,
            format: LogFormat.json,
        },
        transport,
        message: 'hello world',
    });

    assert.equal(stubs.error.getCalls().length, 0, 'error should not be called');
    assert.equal(stubs.warn.getCalls().length, 0, 'warn should not be called');
    assert.equal(stubs.info.getCalls().length, 0, 'info should not be called');
    assert.equal(stubs.debug.getCalls().length, 0, 'debug should not be called');

});

test('error level logs are sent to error transport', (assert) => {

    const {transport, stubs} = createTransportStubs();

    const fakeErr = new Error('my b');

    fakeErr.stack = 'Error: my b\n  at foo.ts:1:1';

    log({
        level: LogLevel.error,
        options: {
            level: LogLevel.info,
            format: LogFormat.json,
        },
        transport,
        error: fakeErr,
    });

    assert.equal(stubs.info.getCalls().length, 0, 'info should not be called');
    assert.equal(stubs.warn.getCalls().length, 0, 'warn should not be called');
    assert.equal(stubs.debug.getCalls().length, 0, 'debug should not be called');
    assert.equal(
        stubs.error.getCalls()[0][0],
        JSON.stringify({
            level: LogLevel.error,
            message: 'my b',
            error: {
                name: 'Error',
                message: 'my b',
                stack: ['foo.ts:1:1'],
            },
        }),
        'error should be called, message should be inferred from error, err should be serialized'
    );

});

test('warn level logs are sent to warn transport', (assert) => {

    const {transport, stubs} = createTransportStubs();

    log({
        level: LogLevel.warn,
        options: {
            level: LogLevel.info,
            format: LogFormat.json,
        },
        transport,
        message: 'warning message',
    });

    assert.equal(stubs.error.getCalls().length, 0, 'error should not be called');
    assert.equal(stubs.info.getCalls().length, 0, 'info should not be called');
    assert.equal(stubs.debug.getCalls().length, 0, 'debug should not be called');
    assert.equal(
        stubs.warn.getCalls()[0][0],
        JSON.stringify({
            level: LogLevel.warn,
            message: 'warning message',
        }),
        'warn transport should receive the message'
    );

});

test('notice level logs are sent to info transport', (assert) => {

    const {transport, stubs} = createTransportStubs();

    log({
        level: LogLevel.notice,
        options: {
            level: LogLevel.info,
            format: LogFormat.json,
        },
        transport,
        message: 'notice message',
    });

    assert.equal(stubs.error.getCalls().length, 0, 'error should not be called');
    assert.equal(stubs.warn.getCalls().length, 0, 'warn should not be called');
    assert.equal(stubs.debug.getCalls().length, 0, 'debug should not be called');
    assert.equal(
        stubs.info.getCalls()[0][0],
        JSON.stringify({
            level: LogLevel.notice,
            message: 'notice message',
        }),
        'info transport should receive notice-level messages'
    );

});

test('fatal/critical level logs are sent to error transport', (assert) => {

    const {transport, stubs} = createTransportStubs();

    log({
        level: LogLevel.fatal,
        options: {
            level: LogLevel.info,
            format: LogFormat.json,
        },
        transport,
        message: 'fatal message',
    });

    assert.equal(stubs.warn.getCalls().length, 0, 'warn should not be called');
    assert.equal(stubs.info.getCalls().length, 0, 'info should not be called');
    assert.equal(stubs.debug.getCalls().length, 0, 'debug should not be called');
    assert.equal(
        stubs.error.getCalls()[0][0],
        JSON.stringify({
            level: LogLevel.fatal,
            message: 'fatal message',
        }),
        'error transport should receive fatal-level messages'
    );

});

test('missing inputs should throw errors', (assert) => {

    // @ts-ignore
    assert.throws(() => log(undefined), new Error('input is required'));
    // @ts-ignore
    assert.throws(() => log({}), new Error('options is required'));
    // @ts-ignore
    assert.throws(() => log({options: {}, transport: {}}), new Error('transport.error must be a function'));
    assert.throws(() => log({
        // @ts-ignore
        options: {},
        // @ts-ignore
        transport: {error: () => {}},
    }), new Error('transport.warn must be a function'));

});

test('logs with no message inherit from error object', (assert) => {

    const {transport, stubs} = createTransportStubs();

    const fakeErr = new Error('my b');

    fakeErr.stack = 'Error: my b\n  at foo.ts:1:1';

    log({
        level: LogLevel.error,
        options: {
            level: LogLevel.info,
            format: LogFormat.json,
        },
        transport,
        error: fakeErr,
    });

    assert.equal(
        stubs.error.getCalls()[0][0],
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

test('logs with message retain message given, not message from error object', (assert) => {

    const {transport, stubs} = createTransportStubs();

    const fakeErr = new Error('my b');

    fakeErr.stack = 'Error: my b\n  at foo.ts:1:1';

    log({
        level: LogLevel.error,
        options: {
            level: LogLevel.info,
            format: LogFormat.json,
        },
        transport,
        error: fakeErr,
        message: 'user-supplied message',
    });

    assert.equal(
        stubs.error.getCalls()[0][0],
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

    const {transport, stubs} = createTransportStubs();

    log({
        level: LogLevel.error,
        options: {
            level: LogLevel.info,
            format: LogFormat.json,
        },
        transport,
        error: {name: 'Error'},
    });

    assert.equal(
        stubs.error.getCalls()[0][0],
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

    const {transport, stubs} = createTransportStubs();

    log({
        level: LogLevel.error,
        options: {
            level: LogLevel.info,
            format: LogFormat.json,
        },
        transport,
        error: {
            name: 'Error',
            message: 'my b',
            stack: 'Error: my b\n  at foo.ts:1:1',
        },
    });

    assert.equal(
        stubs.error.getCalls()[0][0],
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
