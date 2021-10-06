import { StrictService } from '../normalize';
import { _makeProduce, _makeSet, _makeWhen, _makeWith } from './common';
import { FluentImage } from './image';
import { FluentPort } from './port';
import { FluentServiceConfig } from './service-config';
import { FluentServiceNetwork } from './service-network';
import { FluentServiceVolume } from './service-volume';

export interface ServiceRegistration {
    name?: string;
    service: StrictService;
}

export class FluentService {
    constructor(public readonly data: ServiceRegistration) {}
    with = _makeWith<FluentService>(this);
    when = _makeWhen<FluentService>(this);
    set = _makeSet(FluentService);
    produce = _makeProduce(FluentService);

    image = (image: string | FluentImage) =>
        this.with(this.set('service.image', `${image}`));

    env = (key: string, value: string | number | null) =>
        this.with(this.set(['service', 'environment', key], value));

    port = (port: FluentPort) =>
        this.with(
            this.produce(({ service }) => {
                service.ports = service.ports ?? [];
                service.ports.push(port.data);
            })
        );

    volume = (volume: FluentServiceVolume) =>
        this.with(
            this.produce(({ service }) => {
                service.volumes = service.volumes ?? [];
                service.volumes.push(volume.data);
            })
        );

    command = (command: string[] | string) =>
        this.with(
            this.produce(({ service }) => {
                let existingCommands = service.command ?? [];
                if (typeof existingCommands === 'string') {
                    existingCommands = [existingCommands];
                }
                if (typeof command === 'string') {
                    command = [command];
                }
                service.command = [...existingCommands, ...command];
            })
        );

    secret = (secret: FluentServiceConfig) =>
        this.with(
            this.produce(({ service }) => {
                service.secrets = service.secrets ?? [];
                service.secrets.push(secret.data);
            })
        );

    config = (config: FluentServiceConfig) =>
        this.with(
            this.produce(({ service }) => {
                service.configs = service.configs ?? [];
                service.configs.push(config.data);
            })
        );

    network = (network: FluentServiceNetwork) =>
        this.with(
            this.set(
                ['service', 'networks', network.data.name],
                network.data.network
            )
        );
}

export const ServiceFactory = (name?: string) =>
    new FluentService({ service: {}, name });
