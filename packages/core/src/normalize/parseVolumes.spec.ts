import { parseVolumes } from './parseVolumes';

describe('parseVolumes', () => {
    it('should parse volumes', () => {
        expect(
            parseVolumes([
                {
                    type: 'volume',
                    source: 'mydata',
                    target: '/data',
                    volume: {
                        nocopy: true,
                    },
                },
                './foo:/bar:ro',
                '/bar:ro',
                './foo:/bar:rw',
                '/bar:rw',
                './foo:/bar',
                '/bar',
            ])
        ).toEqual([
            {
                type: 'volume',
                source: 'mydata',
                target: '/data',
                volume: {
                    nocopy: true,
                },
            },
            {
                read_only: true,
                source: './foo',
                target: '/bar',
                type: 'volume',
            },
            {
                read_only: true,
                target: '/bar',
                type: 'volume',
            },
            {
                source: './foo',
                target: '/bar',
                type: 'volume',
            },
            {
                target: '/bar',
                type: 'volume',
            },
            {
                source: './foo',
                target: '/bar',
                type: 'volume',
            },
            {
                target: '/bar',
                type: 'volume',
            },
        ]);
    });
});
