import { parseListOrDict } from './parseListOrDict';

describe('parseListOrDict', () => {
    it('should parse list-or-dict', () => {
        expect(parseListOrDict(['FOO=bar', 'BAZ=quux'])).toEqual({
            FOO: 'bar',
            BAZ: 'quux',
        });
    });

    it('should return list-or-dict if it is specified as an object', () => {
        expect(
            parseListOrDict({
                FOO: 'bar',
                BAZ: 'quux',
            })
        ).toEqual({
            FOO: 'bar',
            BAZ: 'quux',
        });
    });

    it('should parse list-or-dict with "=" character in values', () => {
        expect(parseListOrDict(['FOO=bar=quux'])).toEqual({
            FOO: 'bar=quux',
        });
    });
});
