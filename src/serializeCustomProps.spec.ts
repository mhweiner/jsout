import {test} from 'hoare';
import {serializeCustomProps} from './serializeCustomProps';

test('handles circular references safely', (assert) => {

    const meta: any = {};

    meta.self = meta; // circular

    const out = serializeCustomProps({meta});

    assert.equal(out.meta.self, '[Unserializable]');

});

test('truncates overly deep fields', (assert) => {

    const meta = {a: {b: {c: {d: {e: {f: {g: {h: {i: {j: {k: 42}}}}}}}}}}};
    const out = serializeCustomProps({meta}, 0, 5); // maxDepth = 5

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

    const out = serializeCustomProps(err, 0, 5);

    assert.equal(out.items[0], 123);
    assert.equal(out.items[1], 'text');
    assert.equal(out.items[2], {a: 1});
    assert.equal(out.items[3], [1, 2, 3]);
    assert.equal(out.items[4][0], {foo: 'bar'});
    assert.equal(out.items[4][1], '[Unserializable]'); // cycle

});

test('handles getters that throw during serialization gracefully', (assert) => {

    const throwing = {};

    Object.defineProperty(throwing, 'bad', {
        enumerable: true,
        get() {

            throw new Error('💥 trapdoor');

        },
    });

    const out = serializeCustomProps({meta: throwing});

    assert.equal(out.meta.bad, '[Unserializable]');

});

test('returns object as-is if primative', (assert) => {

    assert.equal(serializeCustomProps('string'), 'string');
    assert.equal(serializeCustomProps(42), 42);
    assert.equal(serializeCustomProps(true), true);
    assert.equal(serializeCustomProps(null), null);
    assert.equal(serializeCustomProps(undefined), undefined);

});

test('returns props that are functions as unserializable', (assert) => {

    const obj = {
        a: 1,
        b: (): string => 'test',
        c: {d: (): string => 'test'},
        e: [(): string => 'test'],
    };

    const out = serializeCustomProps(obj);

    assert.equal(out.a, 1, 'should keep number');
    assert.equal(out.b, '[Unserializable]', 'b');
    assert.equal(out.c.d, '[Unserializable]', 'c.d');
    assert.equal(out.e[0], '[Unserializable]', 'e[0]');

});

test('ignores properties starting with "_"', (assert) => {

    const obj = {
        _private: 'secret',
        public: 'visible',
        _hidden: {a: 1},
        objWithHiddenPop: {a: 0, _b: 2},
    };

    assert.equal(
        serializeCustomProps(obj),
        {public: 'visible', objWithHiddenPop: {a: 0}},
        'should ignore private properties'
    );

});

