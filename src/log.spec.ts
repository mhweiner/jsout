import {test} from 'hoare';
import {LogLevel, LogFormat} from '.';
import * as mod from './log';
import {log} from './log';
import {stub} from './lib/stub';
import {serializeError} from './serializeError';
import {normalizeError} from './lib/normalizeError';

test('debug/debug/json/nomessage/nodata', (assert) => {

    // given
    const stderrStub = stub();
    const stdoutStub = stub();
    const opts: mod.LogInput = {
        level: LogLevel.debug,
        options: {
            level: LogLevel.debug,
            format: LogFormat.json,
        },
        transport: {
            stdout: stdoutStub,
            stderr: stderrStub,
        },
    };

    // when
    log(opts);

    // then
    assert.equal(stderrStub.getCalls().length, 0, 'stderr should not be called');
    assert.equal(
        stdoutStub.getCalls()[0][0],
        JSON.stringify({level: LogLevel.debug, message: ''}),
        'stdout should be called with expected data'
    );

});

test('info/info/human', (assert) => {

    // given
    const stderrStub = stub();
    const stdoutStub = stub();
    const opts: mod.LogInput = {
        level: LogLevel.info,
        options: {
            level: LogLevel.info,
            format: LogFormat.human,
        },
        transport: {
            stdout: stdoutStub,
            stderr: stderrStub,
        },
        data: {data: 'data'},
        message: 'hello world',
    };

    // when
    log(opts);

    // then
    assert.equal(stderrStub.getCalls().length, 0, 'stderr should not be called');
    assert.equal(
        stdoutStub.getCalls()[0][0],
        '\n'
        + 'Level: \x1B[1m\x1B[37mINFO\x1B[22m\x1B[39m\n'
        + 'Message: hello world\n'
        + '{ data: \x1B[32m\'data\'\x1B[39m }\n'
    );

});

test('notice/notice/json/message/nodata', (assert) => {

    // given
    const stderrStub = stub();
    const stdoutStub = stub();
    const opts: mod.LogInput = {
        level: LogLevel.notice,
        options: {
            level: LogLevel.notice,
            format: LogFormat.json,
        },
        transport: {
            stdout: stdoutStub,
            stderr: stderrStub,
        },
        message: 'hello world',
    };

    // when
    log(opts);

    // then
    assert.equal(stderrStub.getCalls().length, 0, 'stderr should not be called');
    assert.equal(
        stdoutStub.getCalls()[0][0],
        JSON.stringify({level: LogLevel.notice, message: 'hello world'}),
        'stdout should be called with expected data'
    );

});

test('emerg/emerg/json/nomessage/data', (assert) => {

    // given
    const stderrStub = stub();
    const stdoutStub = stub();
    const opts: mod.LogInput = {
        level: LogLevel.emerg,
        options: {
            level: LogLevel.emerg,
            format: LogFormat.json,
        },
        transport: {
            stdout: stdoutStub,
            stderr: stderrStub,
        },
        data: {data: 'data'},
    };

    // when
    log(opts);

    // then
    assert.equal(stdoutStub.getCalls().length, 0, 'stdout should not be called');
    assert.equal(
        stderrStub.getCalls()[0][0],
        JSON.stringify({level: LogLevel.emerg, message: '', data: {data: 'data'}}),
        'stderr should be called with expected data'
    );

});

test('debug/debug/json/message/data', (assert) => {

    // given
    const stderrStub = stub();
    const stdoutStub = stub();
    const opts: mod.LogInput = {
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
    };

    // when
    log(opts);

    // then
    assert.equal(stderrStub.getCalls().length, 0, 'stderr should not be called');
    assert.equal(
        stdoutStub.getCalls()[0][0],
        JSON.stringify({level: LogLevel.debug, message: 'hello world', data: {data: 'data'}}),
        'stdout should be called with expected data'
    );

});

test('err/err/json', (assert) => {

    // given
    const stderrStub = stub();
    const stdoutStub = stub();
    const fakeErr = new Error('my b');
    const serializedErr = serializeError(fakeErr);
    const opts: mod.LogInput = {
        level: LogLevel.error,
        options: {
            level: LogLevel.error,
            format: LogFormat.json,
        },
        transport: {
            stdout: stdoutStub,
            stderr: stderrStub,
        },
        error: fakeErr,
    };

    // when
    log(opts);

    // then
    assert.equal(stdoutStub.getCalls().length, 0, 'stdout should not be called');
    assert.equal(
        stderrStub.getCalls()[0][0],
        JSON.stringify({level: LogLevel.error, message: 'my b', error: serializedErr}),
        'stderr should be called, message should be inferred from error, err should be serialized'
    );

});

test('should NOT emit logs with level higher than options.level', (assert) => {

    // given
    const stderrStub = stub();
    const stdoutStub = stub();
    const opts: mod.LogInput = {
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
    };

    // when
    log(opts);

    // then
    assert.equal(stdoutStub.getCalls().length, 0, 'stdout should not be called');
    assert.equal(stderrStub.getCalls().length, 0, 'stdout should not be called');

});

test('missing inputs should throw errors', (assert) => {

    // @ts-ignore
    assert.throws(() => log(undefined), new Error('input is required'));
    // @ts-ignore
    assert.throws(() => log({}), new Error('options is required'));
    // @ts-ignore
    assert.throws(() => log({options: {}}), new Error('transport is required'));
    // @ts-ignore
    assert.throws(() => log({options: {}, transport: {}}), new Error('transport.stdout must be a function'));
    // @ts-ignore
    assert.throws(() => log({options: {}, transport: {stdout: () => {}}}), new Error('transport.stderr must be a function'));

});

test('cli format with error', (assert) => {

    // given
    const stderrStub = stub();
    const stdoutStub = stub();
    const fakeErr = new Error('my b');

    const input: mod.LogInput = {
        level: LogLevel.error,
        options: {
            level: LogLevel.error,
            format: LogFormat.cli,
        },
        transport: {
            stdout: stdoutStub,
            stderr: stderrStub,
        },
        error: fakeErr,
    };

    // when
    log(input);

    // then
    assert.equal(stdoutStub.getCalls().length, 0, 'stdout should not be called');
    assert.equal(
        normalizeError(stderrStub.getCalls()[0][0]),
        'Level: ERROR\n'
        + 'Message: my b\n'
        + 'Error: my b\n  [stack]'
    );

});
