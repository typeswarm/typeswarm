import { parseConfigs } from './parseConfigs';

describe('parseConfigs', () => {
    it('should parse short-syntax configs', () => {
        expect(parseConfigs(['foo'])).toEqual([
            {
                source: 'foo',
                target: '/foo',
            },
        ]);
    });

    it('should forward regular configs', () => {
        expect(
            parseConfigs([
                {
                    source: 'foo',
                    target: '/bar',
                },
            ])
        ).toEqual([
            {
                source: 'foo',
                target: '/bar',
            },
        ]);
    });
});
