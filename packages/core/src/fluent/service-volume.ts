import { ok } from 'assert';
import { StrictVolume } from '../normalize';
import { _makeSet, _makeWhen, _makeWith } from './common';
import { FluentVolumeDefinition } from './volume-definition';

export class FluentServiceVolume {
    constructor(public readonly data: StrictVolume) {}
    with = _makeWith<FluentServiceVolume>(this);
    when = _makeWhen<FluentServiceVolume>(this);
    private set = _makeSet(FluentServiceVolume);

    bind = () => this.with(this.set('type', 'bind'));

    volume = () => this.with(this.set('type', 'volume'));

    source = (source: string | FluentVolumeDefinition) => {
        const src = typeof source === 'string' ? source : source.data.name;
        ok(src, 'Source volume name is not set');
        return this.with(this.set('source', src));
    };

    readOnly = () => this.with(this.set('read_only', true));

    noCopy = () => this.with(this.set('volume.nocopy', true));

    propagation = (propagation: string) =>
        this.with(this.set('bind.propagation', propagation));

    size = (size: number) => this.with(this.set('tmpfs.size', size));
}

export const ServiceVolumeFactory = (target: string) =>
    new FluentServiceVolume({ type: 'volume', target });
