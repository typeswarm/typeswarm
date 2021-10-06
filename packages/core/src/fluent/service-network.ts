import { ok } from 'assert';
import { StrictNetwork } from '../normalize';
import { _makeProduce, _makeSet, _makeWhen, _makeWith } from './common';
import { FluentNetworkDefinition } from './network';

interface ServiceNetwork {
    name: string;
    network: StrictNetwork | null;
}

export class FluentServiceNetwork {
    constructor(public readonly data: ServiceNetwork) {}
    with = _makeWith<FluentServiceNetwork>(this);
    when = _makeWhen<FluentServiceNetwork>(this);
    private set = _makeSet(FluentServiceNetwork);
    private produce = _makeProduce(FluentServiceNetwork);

    alias = (item: string) =>
        this.with(
            this.produce(instance => {
                if (!instance.network) {
                    instance.network = {};
                }
                instance.network.aliases = instance.network.aliases ?? [];
                instance.network.aliases.push(item);
            })
        );

    linkLocalIp = (item: string) =>
        this.with(
            this.produce(instance => {
                if (!instance.network) {
                    instance.network = {};
                }
                instance.network.link_local_ips = instance.network.link_local_ips ?? [];
                instance.network.link_local_ips.push(item);
            })
        );

    ipv4Address = (value: string) =>
        this.with(this.set('network.ipv4_address', value));

    ipv6Address = (value: string) =>
        this.with(this.set('network.ipv6_address', value));

    priority = (value: number) =>
        this.with(this.set('network.priority', value));
}

export const ServiceNetworkFactory = (
    networkOrItsName: string | FluentNetworkDefinition
) => {
    const name =
        typeof networkOrItsName === 'string'
            ? networkOrItsName
            : networkOrItsName.data.name;

    ok(name, 'Network name is required');

    return new FluentServiceNetwork({
        name,
        network: null
    });
};
