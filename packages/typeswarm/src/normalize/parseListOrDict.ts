import { DefinitionsService, ListOrDict } from '../compose-spec';
import { Dictionary } from './models';

export function parseListOrDict(
    lod: ListOrDict | undefined
): Dictionary | undefined {
    if (!lod) {
        return undefined;
    }
    if (Array.isArray(lod)) {
        return lod.reduce<Dictionary>((dict, line) => {
            const [, key, val] = line.match('^([^=]+)=(.+)$') || [];
            if (!key) {
                throw new SyntaxError(`Invalid list item ${line}`);
            }
            dict[key] = val.length ? val : null;
            return dict;
        }, {});
    }
    return lod;
}
