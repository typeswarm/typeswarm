import { ok } from 'assert';
import produce from 'immer';
import { set } from 'lodash';
import { StrictVolume } from '../normalize';
import { _makeWhen, _makeWith } from './common';
import { FluentVolumeDefinition } from './volume-definition';

export class FluentServiceVolume {
    constructor(public readonly data: StrictVolume) {}
    with = _makeWith<FluentServiceVolume>(this);
    when = _makeWhen<FluentServiceVolume>(this);

    bind = () => new FluentServiceVolume({ ...this.data, type: 'bind' });
    volume = () => new FluentServiceVolume({ ...this.data, type: 'volume' });
    source = (source: string | FluentVolumeDefinition) => {
        const src = typeof source === 'string' ? source : source.data.name;
        ok(src, 'Source volume name is not set');
        return new FluentServiceVolume({ ...this.data, source: src });
    };
    readOnly = () => new FluentServiceVolume({ ...this.data, readOnly: true });
    noCopy = () =>
        new FluentServiceVolume(
            produce(this.data, (data) => {
                set(data, 'volume.nocopy', true);
            })
        );
    propagation = (propagation: string) =>
        new FluentServiceVolume(
            produce(this.data, (data) => {
                set(data, 'bind.propagation', propagation);
            })
        );
    size = (size: number) =>
        new FluentServiceVolume(
            produce(this.data, (data) => {
                set(data, 'tmpfs.size', size);
            })
        );
}

export const ServiceVolumeFactory = (target: string) =>
    new FluentServiceVolume({ type: 'volume', target });
