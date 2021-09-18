import produce from 'immer';
import { StrictService } from '../normalize';
import { _makeWhen, _makeWith } from './common';
import { FluentImage } from './image';
import { FluentPort } from './port';
import { FluentServiceVolume } from './service-volume';

export interface ServiceRegistration {
    name?: string;
    service: StrictService;
}

export class FluentService {
    constructor(public readonly data: ServiceRegistration) {}
    with = _makeWith<FluentService>(this);
    when = _makeWhen<FluentService>(this);

    image = (image: string | FluentImage) =>
        new FluentService({
            ...this.data,
            service: {
                ...this.data.service,
                image: `${image}`,
            },
        });

    env = (key: string, value: string | number | null) =>
        new FluentService(
            produce(this.data, ({ service }) => {
                service.environment = service.environment ?? {};
                service.environment[key] = value;
            })
        );

    port = (port: FluentPort) =>
        new FluentService(
            produce(this.data, ({ service }) => {
                service.ports = service.ports ?? [];
                service.ports.push(port.data);
            })
        );

    volume = (volume: FluentServiceVolume) =>
        new FluentService(
            produce(this.data, ({ service }) => {
                service.volumes = service.volumes ?? [];
                service.volumes.push(volume.data);
            })
        );
}

export const ServiceFactory = (name?: string) =>
    new FluentService({ service: {}, name });
