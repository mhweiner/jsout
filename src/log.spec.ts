import {test} from 'hoare';
import {LogLevel, LogFormat} from '.';
import * as mod from './log';
import {stub} from 'sinon';
import {log} from './log';
import {serializeError} from 'serialize-error';
import util from 'node:util';

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
    assert.equal(stderrStub.callCount, 0, 'stderr should not be called');
    assert.equal(
        stdoutStub.args[0][0],
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
    assert.equal(stderrStub.callCount, 0, 'stderr should not be called');
    assert.equal(
        stdoutStub.args[0][0],
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
    assert.equal(stderrStub.callCount, 0, 'stderr should not be called');
    assert.equal(
        stdoutStub.args[0][0],
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
    assert.equal(stdoutStub.callCount, 0, 'stdout should not be called');
    assert.equal(
        stderrStub.args[0][0],
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
    assert.equal(stderrStub.callCount, 0, 'stderr should not be called');
    assert.equal(
        stdoutStub.args[0][0],
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
        level: LogLevel.err,
        options: {
            level: LogLevel.err,
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
    assert.equal(stdoutStub.callCount, 0, 'stdout should not be called');
    assert.equal(
        stderrStub.args[0][0],
        JSON.stringify({level: LogLevel.err, message: 'my b', error: serializedErr}),
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
    assert.equal(stdoutStub.callCount, 0, 'stdout should not be called');
    assert.equal(stderrStub.callCount, 0, 'stdout should not be called');

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

test('human format with error', (assert) => {

    // given
    const stderrStub = stub();
    const stdoutStub = stub();
    const fakeErr = new Error('my b');

    delete fakeErr.stack;

    const opts: mod.LogInput = {
        level: LogLevel.err,
        options: {
            level: LogLevel.err,
            format: LogFormat.human,
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
    assert.equal(stdoutStub.callCount, 0, 'stdout should not be called');
    assert.equal(
        stderrStub.args[0][0],
        '\n'
        + 'Level: \x1B[1m\x1B[31mERROR\x1B[22m\x1B[39m\n'
        + 'Message: my b\n'
        + `${util.inspect(fakeErr, {colors: true, depth: null})}\n`
    );

});


/*

test('should emit logs with level lower than or equal to options.level', (assert) => {

    // given
    const options: CliOptions = {
        level: LogLevel.info,
        format: LogFormat.json,
    };
    const outputStub = stub();
    const m: typeof mod = mock('./log', {
        './output': {output: outputStub},
    });

    // when
    m.log({level: LogLevel.debug, options});
    m.log({level: LogLevel.info, options});
    m.log({level: LogLevel.warn, options});
    m.log({level: LogLevel.error, options});
    m.log({level: LogLevel.fatal, options});

    // then
    assert.equal(outputStub.callCount, 4, 'output() should be called 4 times');

});

test('should contain passed message and data', (assert) => {

    // given
    const options: CliOptions = {
        level: LogLevel.fatal,
        format: LogFormat.json,
    };
    const outputStub = stub();
    const m: typeof mod = mock('./log', {
        './output': {output: outputStub},
    });

    // when
    m.log({
        level: LogLevel.fatal,
        message: 'hello world',
        data: {data: 'data'},
        options,
    });

    // then
    assert.equal(outputStub.args[0][0], {
        level: 60,
        message: 'hello world',
        error: undefined,
        data: {data: 'data'},
    });

});

test('if message is not passed, message should be inferred from error', (assert) => {

    // given
    const options: CliOptions = {
        level: LogLevel.fatal,
        format: LogFormat.json,
    };
    const outputStub = stub();
    const m: typeof mod = mock('./log', {
        './output': {output: outputStub},
    });

    // when
    m.log({
        level: LogLevel.fatal,
        error: new Error('test'),
        options,
    });

    // then
    assert.equal(outputStub.args[0][0].message, 'test');

});

test('error should be same as one passed', (assert) => {

    // given
    const options: CliOptions = {
        level: LogLevel.fatal,
        format: LogFormat.json,
    };
    const outputStub = stub();
    const m: typeof mod = mock('./log', {
        './output': {output: outputStub},
    });
    const fakeError = new Error('fake');

    // when
    m.log({
        level: LogLevel.fatal,
        error: fakeError,
        options,
    });

    // then
    assert.equal(outputStub.args[0][0].error, fakeError);

});

test('output should use STDERR if level <= WARN (4), STDOUT if level > WARN (4)', (assert) => {

    // given
    const stubs = {
        stderr: stub(),
        stdout: stub(),
    };
    const opts = {
        level: LogLevel.fatal,
        format: LogFormat.json,
    };
    const m: typeof mod = mock('./output', {
        './transports': {transports: {stderr: stubs.stderr, stdout: stubs.stdout}},
    });

    // when
    m.log({level: LogLevel.debug}, opts);
    m.log({level: LogLevel.info}, opts);
    m.log({level: LogLevel.warn}, opts);
    m.log({level: LogLevel.error}, opts);
    m.log({level: LogLevel.fatal}, opts);

    // then
    assert.equal(stubs.stdout.callCount, 3, 'stdout should be called 3 times');
    assert.equal(stubs.stderr.callCount, 3, 'stderr should be called 3 times');

});

test('output should be stringified json if format is json', (assert) => {

    // given
    const stubs = {
        stderr: stub(),
        stdout: stub(),
    };
    const opts = {
        level: LogLevel.fatal,
        format: LogFormat.json,
    };
    const m: typeof mod = mock('./output', {
        './transports': {transports: {stderr: stubs.stderr, stdout: stubs.stdout}},
    });

    // when
    m.log({level: LogLevel.info, message: 'fake message', data: {fake: 'data'}}, opts);

    // then
    assert.equal(stubs.stdout.args, [[
        '{"level":10,"message":"fake message","data":{"fake":"data"}}',
    ]], 'stdout should be called once with expected data');

});

*/
