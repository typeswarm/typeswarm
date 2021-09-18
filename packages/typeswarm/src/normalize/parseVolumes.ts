import { DefinitionsService } from '../compose-spec';
import { StrictVolume } from './models';

export function parseVolumes(
    volumes: DefinitionsService['volumes']
): StrictVolume[] | undefined {
    if (!volumes) {
        return undefined;
    }
    return volumes.map(parseVolume);
}

function parseVolume(volume: StrictVolume | string): StrictVolume {
    if (typeof volume === 'string') {
        const parts = volume.split(':');
        if (!parts.length) {
            throw new SyntaxError(`Could not parse volume ${volume}`);
        }
        let mode;
        const lastPart = parts[parts.length - 1];
        if (lastPart === 'rw' || lastPart === 'ro') {
            mode = parts.pop();
        }
        const target = parts.pop();
        if (target === undefined) {
            throw new SyntaxError(`Could not parse volume ${volume}`);
        }
        const source = parts.pop();

        const strictVolume: StrictVolume = { type: 'volume', target };
        if (mode === 'ro') {
            strictVolume.read_only = true;
        }
        if (source !== undefined) {
            strictVolume.source = source;
        }
        return strictVolume;
    }
    return volume;
}
