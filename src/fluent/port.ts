import { StrictPortMapping } from '../normalize';
import { _makeWhen, _makeWith } from './common';

export class FluentPort {
    constructor(public readonly data: StrictPortMapping) {}
    with = _makeWith<FluentPort>(this);
    when = _makeWhen<FluentPort>(this);

    as = (published: number) => new FluentPort({ ...this.data, published });
    udp = () => new FluentPort({ ...this.data, protocol: 'udp' });
    tcp = () => new FluentPort({ ...this.data, protocol: 'tcp' });
    host = () => new FluentPort({ ...this.data, mode: 'host' });
    ingress = () => new FluentPort({ ...this.data, mode: 'ingress' });
}

export const PortFactory = (
    target: number,
    protocol?: StrictPortMapping['protocol']
) => new FluentPort({ target, protocol });
