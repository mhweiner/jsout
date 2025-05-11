import {test} from 'hoare';
import {serializeError} from './serializeError';

test('serializes a basic Error', (assert) => {

    const err = new Error('Something went wrong');
    const out = serializeError(err);

    assert.equal({...out, stack: '[stack removed]'}, {
        name: 'Error',
        message: 'Something went wrong',
        stack: '[stack removed]',
    });

});

test('serializes an Error with a cause', (assert) => {

    const inner = new Error('Inner error');
    const outer = new Error('Outer error', {cause: inner});

    const out = serializeError(outer);

    assert.equal({
        ...out,
        stack: '[stack removed]',
        cause: {...out.cause, stack: '[stack removed]'},
    }, {
        name: 'Error',
        message: 'Outer error',
        stack: '[stack removed]',
        cause: {
            name: 'Error',
            message: 'Inner error',
            stack: '[stack removed]',
        },
    });

});

test('serializes deeply nested causes', (assert) => {

    const err3 = new Error('Low-level failure');
    const err2 = new Error('Mid-level failure', {cause: err3});
    const err1 = new Error('Top-level failure', {cause: err2});

    const out = serializeError(err1);

    // Strip stack traces for comparison
    out.stack = '[stack removed]';
    out.cause.stack = '[stack removed]';
    out.cause.cause.stack = '[stack removed]';

    assert.equal(out, {
        name: 'Error',
        message: 'Top-level failure',
        stack: '[stack removed]',
        cause: {
            name: 'Error',
            message: 'Mid-level failure',
            stack: '[stack removed]',
            cause: {
                name: 'Error',
                message: 'Low-level failure',
                stack: '[stack removed]',
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
    const out = serializeError(err);

    assert.equal({...out, stack: '[stack removed]'}, {
        name: 'MyError',
        message: 'Access denied',
        stack: '[stack removed]',
        status: 403,
        meta: {reason: 'denied'},
    });

});

test('non-Error input returns as-is', (assert) => {

    const obj = {foo: 'bar', num: 42};
    const out = serializeError(obj);

    assert.equal(out, obj);

});

test('serializes stack into array of lines', (assert) => {

    const err = new Error('Boom!');
    const out = serializeError(err);

    assert.equal(out.name, 'Error');
    assert.equal(out.message, 'Boom!');
    assert.isTrue(Array.isArray(out.stack));
    assert.isTrue(out.stack.length > 1);
    assert.equal(out.stack[0], 'Error: Boom!');
    assert.isTrue(out.stack[1].trim().startsWith('at '));

});

test('handles circular references safely', (assert) => {

    const meta: any = {};

    meta.self = meta; // circular

    const err = new Error('circular');

    (err as any).meta = meta;

    const out = serializeError(err);

    assert.equal(out.message, 'circular');
    assert.equal(out.meta.self, '[Unserializable]');

});

test('truncates overly deep fields', (assert) => {

    const deep = {a: {b: {c: {d: {e: {f: {g: {h: {i: {j: {k: 42}}}}}}}}}}};

    const err = new Error('too deep');

    (err as any).meta = deep;

    const out = serializeError(err, 0, 5); // maxDepth = 5

    assert.equal(out.meta, {a: {b: {c: {d: {e: '[Unserializable]'}}}}});

});

test('serializes arrays inside error objects correctly', (assert) => {

    const circular: any[] = [];

    circular.push({foo: 'bar'}, circular); // create a cycle in the array

    const err = new Error('array test');

    (err as any).items = [
        123,
        'text',
        {a: 1},
        [1, 2, 3],
        circular,
    ];

    const out = serializeError(err, 0, 5);

    assert.equal(out.items[0], 123);
    assert.equal(out.items[1], 'text');
    assert.equal(out.items[2], {a: 1});
    assert.equal(out.items[3], [1, 2, 3]);
    assert.equal(out.items[4][0], {foo: 'bar'});
    assert.equal(out.items[4][1], '[Unserializable]'); // cycle

});

test('triggers serializeError catch for top-level property access', (assert) => {

    const err = new Error('fail');

    Object.defineProperty(err, 'badProp', {
        enumerable: true,
        get() {

            throw new Error('💥 boom');

        },
    });

    const out = serializeError(err);

    assert.equal(out.badProp, '[Unserializable]');

});

test('handles getters that throw during serialization gracefully', (assert) => {

    const throwing = {};

    Object.defineProperty(throwing, 'bad', {
        enumerable: true,
        get() {

            throw new Error('💥 trapdoor');

        },
    });

    const err = new Error('fail');

    (err as any).meta = throwing;

    const out = serializeError(err);

    assert.equal(out.meta.bad, '[Unserializable]');

});

test('calls .toJSON() if defined', (assert) => {

    class Response extends Error {

        constructor(msg: string, public status = 403, public meta = {reason: 'denied'}) {

            super(msg);
            this.name = 'Response';

        }

        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        toJSON() {

            return {
                toJSON: 'wascalled!',
            };

        }

    }
    const err = new Response('Access denied');
    const out = serializeError(err);

    assert.equal({...out, stack: '[stack removed]'}, {
        name: 'Response',
        message: 'Access denied',
        stack: '[stack removed]',
        toJSON: 'wascalled!',
    });

});

test('handles .toJSON() failure gracefully by using normal fallback', (assert) => {

    class Response extends Error {

        constructor(msg: string, public status = 403, public meta = {reason: 'denied'}) {

            super(msg);
            this.name = 'Response';

        }

        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        toJSON() {

            throw new Error('💥 trapdoor');

        }

    }
    const err = new Response('Access denied');
    const out = serializeError(err);

    assert.equal({...out, stack: '[stack removed]'}, {
        name: 'Response',
        message: 'Access denied',
        status: 403,
        meta: {reason: 'denied'},
        stack: '[stack removed]',
    });

});

test('catches error during array item serialization in limitDepth', (assert) => {

    const err = new Error('bad array');
    const badItem = {
        get ok(): boolean {

            // This property is fine
            return true;

        },
    };

    // Force failure when accessing a property inside limitDepth
    Object.defineProperty(badItem, 'oops', {
        enumerable: true,
        get() {

            throw new Error('💥 recursive trap');

        },
    });

    (err as any).array = [1, badItem];

    const out = serializeError(err);

    assert.equal(out.array[0], 1);
    assert.equal(out.array[1], {
        ok: true,
        oops: '[Unserializable]',
    });

});
