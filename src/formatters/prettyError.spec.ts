import {test} from 'hoare';
import {prettyError} from './prettyError';
import {normalizeLogOutput} from '../lib/normalizeLogOutput';

test('prints a simple error with stack', (assert) => {

    const err = new Error('Something went wrong');
    const out = normalizeLogOutput(prettyError(err));

    assert.equal(out, [
        'Error: Something went wrong',
        '  [stack]',
    ].join('\n'));

});

test('prints custom fields on error', (assert) => {

    class CustomError extends Error {

        constructor(message: string, public code = 'E_FAIL', public meta = {id: 123}) {

            super(message);
            this.name = 'CustomError';

        }

    }

    const err = new CustomError('Something broke');
    const out = normalizeLogOutput(prettyError(err));

    assert.equal(out, [
        'CustomError: Something broke',
        '  [stack]',
        'code: \'E_FAIL\'',
        'meta: { id: 123 }',
    ].join('\n'));

});

test('prints cause chain in flat format', (assert) => {

    const low = new Error('Root cause');
    const mid = new Error('Mid failure', {cause: low});
    const top = new Error('Top failure', {cause: mid});

    const out = normalizeLogOutput(prettyError(top));

    assert.equal(out, [
        'Error: Top failure',
        '  [stack]',
        '↳ Caused by:',
        'Error: Mid failure',
        '  [stack]',
        '↳ Caused by:',
        'Error: Root cause',
        '  [stack]',
    ].join('\n'));

});
