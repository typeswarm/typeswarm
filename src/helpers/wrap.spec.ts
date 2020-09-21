import { wrap } from './wrap';

describe('wrap', () => {
    interface FooBar {
        foo: number;
        bar: number;
    }
    const x: FooBar = { bar: 3, foo: 5 };
    const fbSqr = (a: FooBar): FooBar => {
        return {
            foo: a.foo * a.foo,
            bar: a.bar * a.bar,
        };
    };
    const fbPlusOne = (a: FooBar): FooBar => {
        return {
            foo: a.foo + 1,
            bar: a.bar + 1,
        };
    };

    it('should wrap using chained call', () => {
        expect(wrap(x).with(fbSqr).with(fbPlusOne).value()).toEqual({
            foo: 26,
            bar: 10,
        });
    });

    it('should wrap using rest parameters', () => {
        expect(wrap(x).with(fbSqr, fbPlusOne).value()).toEqual({
            foo: 26,
            bar: 10,
        });
    });

    it('should wrap using nested array', () => {
        expect(
            wrap(x)
                .with([[fbSqr, fbPlusOne], [[[fbPlusOne]]]])
                .value()
        ).toEqual({
            foo: 27,
            bar: 11,
        });
    });
});
