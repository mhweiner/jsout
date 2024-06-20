import {test} from 'hoare';
import {ErrorLevel, LogFormat} from '.';
import * as outputModule from './output';
import {mock} from 'cjs-mock';
import {stub} from 'sinon';

test('output should use stdout if level <= INFO, stderr if level > INFO', (assert) => {

    // given
    const stubs = {
        stderr: stub(),
        stdout: stub(),
    };
    const opts = {
        level: ErrorLevel.fatal,
        format: LogFormat.json,
    };
    const m: typeof outputModule = mock('./output', {
        './transports': {transports: {stderr: stubs.stderr, stdout: stubs.stdout}},
    });

    // when
    m.output({level: ErrorLevel.trace}, opts);
    m.output({level: ErrorLevel.debug}, opts);
    m.output({level: ErrorLevel.info}, opts);
    m.output({level: ErrorLevel.warn}, opts);
    m.output({level: ErrorLevel.error}, opts);
    m.output({level: ErrorLevel.fatal}, opts);

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
        level: ErrorLevel.fatal,
        format: LogFormat.json,
    };
    const m: typeof outputModule = mock('./output', {
        './transports': {transports: {stderr: stubs.stderr, stdout: stubs.stdout}},
    });

    // when
    m.output({level: ErrorLevel.trace, message: 'fake message', data: {fake: 'data'}}, opts);

    // then
    assert.equal(stubs.stdout.args, [[
        '{"level":10,"message":"fake message","data":{"fake":"data"}}',
    ]], 'stdout should be called once with expected data');

});
