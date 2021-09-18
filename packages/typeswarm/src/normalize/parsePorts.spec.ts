import { parsePorts } from './parsePorts';

describe('parsePorts', () => {
    it('should parse ports', () => {
        expect(parsePorts(['8080:80'])).toEqual([
            {
                published: 8080,
                target: 80,
            },
        ]);
        expect(parsePorts(['8080:80/tcp'])).toEqual([
            {
                published: 8080,
                target: 80,
                protocol: 'tcp',
            },
        ]);
        expect(parsePorts(['80'])).toEqual([
            {
                target: 80,
            },
        ]);
        expect(parsePorts(['80', '111:1111'])).toEqual([
            {
                target: 80,
            },
            {
                published: 111,
                target: 1111,
            },
        ]);
    });

    it('should parse port ranges', () => {
        expect(parsePorts(['1000-1002:80-82'])).toEqual([
            {
                published: 1000,
                target: 80,
            },
            {
                published: 1001,
                target: 81,
            },
            {
                published: 1002,
                target: 82,
            },
        ]);
        expect(parsePorts(['1000-1002:80-82/udp'])).toEqual([
            {
                published: 1000,
                target: 80,
                protocol: 'udp',
            },
            {
                published: 1001,
                target: 81,
                protocol: 'udp',
            },
            {
                published: 1002,
                target: 82,
                protocol: 'udp',
            },
        ]);
        expect(parsePorts(['80-82/udp'])).toEqual([
            {
                target: 80,
                protocol: 'udp',
            },
            {
                target: 81,
                protocol: 'udp',
            },
            {
                target: 82,
                protocol: 'udp',
            },
        ]);
    });

    it('should throw on errors', () => {
        expect(() => parsePorts(['abracadabra'])).toThrowError(
            'Could not parse port mapping abracadabra'
        );
        expect(() => parsePorts(['8080-2020:80-20'])).toThrowError(
            'Invalid ports range 8080-2020'
        );
        expect(() => parsePorts(['8080-2020:80-20'])).toThrowError(
            'Invalid ports range 8080-2020'
        );
        expect(() => parsePorts(['500-7000'])).toThrowError(
            'Too big ports range 500-7000'
        );
    });

    it('should forward long-syntax ports', () => {
        expect(
            parsePorts([
                {
                    target: 80,
                    protocol: 'udp',
                },
                {
                    target: 81,
                    protocol: 'udp',
                },
                {
                    target: 82,
                    protocol: 'udp',
                },
            ])
        ).toEqual([
            {
                target: 80,
                protocol: 'udp',
            },
            {
                target: 81,
                protocol: 'udp',
            },
            {
                target: 82,
                protocol: 'udp',
            },
        ]);
    });
});
