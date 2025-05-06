import {test} from 'hoare';
import {mockLoggerFactory} from './mockLoggerFactory';

test('records calls with correct level aliases', (assert) => {

    const logger = mockLoggerFactory();

    logger.emerg('system down');
    logger.alert('critical alert');
    logger.fatal('fatal crash');
    logger.error('normal error');
    logger.warn('low disk');
    logger.notice('user logged in');
    logger.info('starting up');
    logger.debug('loop iteration');

    assert.equal(logger.getCalls(), [
        ['critical', 'system down', undefined, undefined],
        ['critical', 'critical alert', undefined, undefined],
        ['critical', 'fatal crash', undefined, undefined],
        ['error', 'normal error', undefined, undefined],
        ['warning', 'low disk', undefined, undefined],
        ['notice', 'user logged in', undefined, undefined],
        ['info', 'starting up', undefined, undefined],
        ['debug', 'loop iteration', undefined, undefined],
    ]);

});

test('handles error and data correctly for error levels', (assert) => {

    const logger = mockLoggerFactory();

    const err = new Error('boom');
    const data = {code: 500};

    logger.error('fail', err, data);
    logger.warn('oops', err, data);
    logger.critical('crash', err, data);

    assert.equal(logger.getCalls(), [
        ['error', 'fail', err, data],
        ['warning', 'oops', err, data],
        ['critical', 'crash', err, data],
    ]);

});

test('handles data in second arg for non-error levels', (assert) => {

    const logger = mockLoggerFactory();

    const data = {foo: 123};

    logger.info('startup', data);
    logger.debug('loop', data);
    logger.notice('welcome', data);

    assert.equal(logger.getCalls(), [
        ['info', 'startup', undefined, data],
        ['debug', 'loop', undefined, data],
        ['notice', 'welcome', undefined, data],
    ]);

});

test('returns call list in order with getCalls()', (assert) => {

    const logger = mockLoggerFactory();

    logger.error('err1');
    logger.info('info1');
    logger.error('err2');

    const calls = logger.getCalls();

    assert.equal(calls.length, 3);
    assert.equal(calls[0][1], 'err1');
    assert.equal(calls[1][1], 'info1');
    assert.equal(calls[2][1], 'err2');

});
