import {test} from 'hoare';
import {ErrorLevel, LogFormat, Options} from '.';
import * as logModule from './log';
import {mock} from 'cjs-mock';
import {stub} from 'sinon';

test('should emit logs with level higher than or equal to options.level', (assert) => {

    // given
    const options: Options = {
        level: ErrorLevel.info,
        format: LogFormat.json,
    };
    const outputStub = stub();
    const m: typeof logModule = mock('./log', {
        './output': {output: outputStub},
    });

    // when
    m.log({level: ErrorLevel.trace, options});
    m.log({level: ErrorLevel.debug, options});
    m.log({level: ErrorLevel.info, options});
    m.log({level: ErrorLevel.warn, options});
    m.log({level: ErrorLevel.error, options});
    m.log({level: ErrorLevel.fatal, options});

    // then
    assert.equal(outputStub.callCount, 4, 'output() should be called 4 times');

});

test('should contain passed message and data', (assert) => {

    // given
    const options: Options = {
        level: ErrorLevel.fatal,
        format: LogFormat.json,
    };
    const outputStub = stub();
    const m: typeof logModule = mock('./log', {
        './output': {output: outputStub},
    });

    // when
    m.log({
        level: ErrorLevel.fatal,
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
    const options: Options = {
        level: ErrorLevel.fatal,
        format: LogFormat.json,
    };
    const outputStub = stub();
    const m: typeof logModule = mock('./log', {
        './output': {output: outputStub},
    });

    // when
    m.log({
        level: ErrorLevel.fatal,
        error: new Error('test'),
        options,
    });

    // then
    assert.equal(outputStub.args[0][0].message, 'test');

});

test('error should be same as one passed', (assert) => {

    // given
    const options: Options = {
        level: ErrorLevel.fatal,
        format: LogFormat.json,
    };
    const outputStub = stub();
    const m: typeof logModule = mock('./log', {
        './output': {output: outputStub},
    });
    const fakeError = new Error('fake');

    // when
    m.log({
        level: ErrorLevel.fatal,
        error: fakeError,
        options,
    });

    // then
    assert.equal(outputStub.args[0][0].error, fakeError);

});


