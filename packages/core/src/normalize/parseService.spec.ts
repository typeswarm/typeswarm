import { DefinitionsService } from '../compose-spec';
import { parseService } from './parseService';

describe('parseService', () => {
    it('should parse service with short-syntax settings', () => {
        const srv: DefinitionsService = {
            image: 'foo',
            ports: ['8080:80', '2222:22', '1968:1968/udp'],
            environment: ['PORT=500', 'PASSWORD=foo+-=786'],
            command: ['--debug=true'],
            volumes: ['data:/etc/data:ro'],
        };

        const strictSrv = parseService(srv);

        expect(strictSrv).toEqual({
            image: 'foo',
            command: ['--debug=true'],
            environment: {
                PASSWORD: 'foo+-=786',
                PORT: '500',
            },
            ports: [
                {
                    published: 8080,
                    target: 80,
                },
                {
                    published: 2222,
                    target: 22,
                },
                {
                    protocol: 'udp',
                    published: 1968,
                    target: 1968,
                },
            ],
            volumes: [
                {
                    type: 'volume',
                    read_only: true,
                    target: '/etc/data',
                    source: 'data',
                },
            ],
        });
    });
});
