import {test} from 'kizu';
import {serializeError} from './serializeError';

test('serializes a basic Error', (assert) => {

    const err = new Error('Something went wrong');

    // replace stack with a placeholder
    err.stack = 'Error: Something went wrong\n  at /src/serializeError.spec.ts:1:1';

    const out = serializeError(err);

    assert.equal(out, {
        name: 'Error',
        message: 'Something went wrong',
        stack: ['/src/serializeError.spec.ts:1:1'],
    });

});

test('serializes an Error with a cause', (assert) => {

    const inner = new Error('Inner error');
    const outer = new Error('Outer error', {cause: inner});

    // replace stacks with a placeholder
    inner.stack = 'Error: Inner error\n  at /src/serializeError.spec.ts:1:1';
    outer.stack = 'Error: Outer error\n  at /src/serializeError.spec.ts:2:2';

    const out = serializeError(outer);

    assert.equal(out, {
        name: 'Error',
        message: 'Outer error',
        stack: ['/src/serializeError.spec.ts:2:2'],
        cause: {
            name: 'Error',
            message: 'Inner error',
            stack: ['/src/serializeError.spec.ts:1:1'],
        },
    });

});

test('serializes deeply nested causes', (assert) => {

    const err3 = new Error('Low-level failure');
    const err2 = new Error('Mid-level failure', {cause: err3});
    const err1 = new Error('Top-level failure', {cause: err2});

    // replace stacks with a placeholder
    err3.stack = 'Error: Low-level failure\n  at /src/serializeError.spec.ts:3:3';
    err2.stack = 'Error: Mid-level failure\n  at /src/serializeError.spec.ts:2:2';
    err1.stack = 'Error: Top-level failure\n  at /src/serializeError.spec.ts:1:1';

    const out = serializeError(err1);

    assert.equal(out, {
        name: 'Error',
        message: 'Top-level failure',
        stack: ['/src/serializeError.spec.ts:1:1'],
        cause: {
            name: 'Error',
            message: 'Mid-level failure',
            stack: ['/src/serializeError.spec.ts:2:2'],
            cause: {
                name: 'Error',
                message: 'Low-level failure',
                stack: ['/src/serializeError.spec.ts:3:3'],
            },
        },
    });

});

test('serializes custom error with extra fields', (assert) => {

    class MyError extends Error {

        constructor(msg: string, public status = 403, public meta = {reason: 'denied'}) {

            super(msg);
            this.name = 'MyError';

        }

    }

    const err = new MyError('Access denied');

    // replace stacks with a placeholder
    err.stack = 'MyError: Access denied\n  at /src/serializeError.spec.ts:3:3';

    const out = serializeError(err);

    assert.equal(out, {
        name: 'MyError',
        message: 'Access denied',
        stack: ['/src/serializeError.spec.ts:3:3'],
        status: 403,
        meta: {reason: 'denied'},
    });

});

test('omits internal frames and other common junk from the stack', (assert) => {

    const err = new Error('Internal error');

    err.stack = `Error: Internal error
    at node:internal/errors:1:1
    at node:internal/async_hooks:1:1
    at node:internal/process/next_tick:1:1
    at internal/bootstrap_node.js:1:1
    at internal/modules/cjs/loader.js:1:1
    at processTicksAndRejections (node:internal/process/task_queues:1:1)
    at Generator.next (<anonymous>)
    at Module._load (internal/modules/cjs/loader.js:1:1)
    at __internal_marker__:1:1
    at /src/serializeError.spec.ts:1:1`;

    const out = serializeError(err);

    assert.equal(out, {
        name: 'Error',
        message: 'Internal error',
        stack: ['/src/serializeError.spec.ts:1:1'],
    });

});

test('errors without stack traces return empty array as stack', (assert) => {

    const err = new Error('Something went wrong');

    // replace stack with a placeholder
    err.stack = undefined;

    const out = serializeError(err);

    assert.equal(out, {
        name: 'Error',
        message: 'Something went wrong',
        stack: [],
    });

});

test('errors without stack traces return empty array as stack', (assert) => {

    const err = new Error('Something went wrong');

    // replace stack with a placeholder
    err.stack = undefined;

    const out = serializeError(err);

    assert.equal(out, {
        name: 'Error',
        message: 'Something went wrong',
        stack: [],
    });

});

