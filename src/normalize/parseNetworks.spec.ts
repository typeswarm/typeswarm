import { parseNetworks } from './parseNetworks';

describe('parseNetworks', () => {
    it('should parse short-syntax networks', () => {
        expect(parseNetworks(['default', 'net1'])).toEqual({
            default: null,
            net1: null,
        });
    });
    it('should forward long-syntax networks', () => {
        expect(
            parseNetworks({
                default: {
                    aliases: ['foo', 'bar'],
                },
                net1: null,
            })
        ).toEqual({
            default: {
                aliases: ['foo', 'bar'],
            },
            net1: null,
        });
    });
});
