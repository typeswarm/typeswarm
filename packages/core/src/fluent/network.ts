import { DefinitionsNetwork } from '../compose-spec';
import { parseListOrDict } from '../normalize';
import { _makeProduce, _makeSet, _makeWhen, _makeWith } from './common';

export interface NetworkRegistration {
    name?: string;
    network: DefinitionsNetwork;
}

export class FluentNetworkDefinition {
    constructor(public readonly data: NetworkRegistration) {}
    with = _makeWith<FluentNetworkDefinition>(this);
    when = _makeWhen<FluentNetworkDefinition>(this);
    private set = _makeSet(FluentNetworkDefinition);
    private produce = _makeProduce(FluentNetworkDefinition);

    driver = (driver: string) => this.with(this.set('network.driver', driver));

    driverOpts = (driverOpts: Record<string, string | number>) =>
        this.with(this.set('network.driver_opts', driverOpts));

    external = (flagOrName: boolean | string | void) =>
        this.when(typeof flagOrName === 'string', _ =>
            _.with(this.set('network.external.name', flagOrName))
        )
            .when(typeof flagOrName === 'boolean', _ =>
                _.with(this.set('network.external', flagOrName))
            )
            .when(typeof flagOrName === 'undefined', _ =>
                _.with(this.set('network.external', true))
            );

    internal = (internal: boolean) =>
        this.with(this.set('network.internal', internal));

    attachable = (attachable: boolean) =>
        this.with(this.set('network.attachable', attachable));

    enableIPv6 = (enable_ipv6: boolean) =>
        this.with(this.set('network.enable_ipv6', enable_ipv6));

    label = (key: string, value: string | number | boolean | null) =>
        this.with(
            this.produce(({ network }) => {
                network.labels = parseListOrDict(network.labels) ?? {};
                network.labels[key] = value;
            })
        );

    //TODO: ipam block!
}

export const NetworkDefinitionFactory = (name?: string) =>
    new FluentNetworkDefinition({ name, network: {} });
