import { StrictPortMapping } from '../normalize';
import { _makeSet, _makeWhen, _makeWith } from './common';

export class FluentPort {
    constructor(public readonly data: StrictPortMapping) {}
    with = _makeWith<FluentPort>(this);
    when = _makeWhen<FluentPort>(this);
    private set = _makeSet(FluentPort);

    as = (published: number) => this.with(this.set({ published }));
    udp = () => this.with(this.set('protocol', 'udp'));
    tcp = () => this.with(this.set('protocol', 'tcp'));
    host = () => this.with(this.set('mode', 'host'));
    ingress = () => this.with(this.set('mode', 'ingress'));
}

export const PortFactory = (
    target: number,
    protocol?: StrictPortMapping['protocol']
) => new FluentPort({ target, protocol });
