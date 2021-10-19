import { ok } from 'assert';
import { _makeWhen, _makeWith } from './common';
import { BaseFluentServiceVolume } from './generated/BaseFluentServiceVolume';
import { FluentVolumeDefinition } from './volume-definition';

export class FluentServiceVolume extends BaseFluentServiceVolume {
    with = _makeWith<FluentServiceVolume>(this);
    when = _makeWhen<FluentServiceVolume>(this);

    source = (source: string | FluentVolumeDefinition) => {
        const src = typeof source === 'string' ? source : source.data.name;
        ok(src, 'Source volume name is not set');
        return this.sourceStr(src);
    };
}

export const ServiceVolumeFactory = (target: string) =>
    new FluentServiceVolume({ type: 'volume', target });
