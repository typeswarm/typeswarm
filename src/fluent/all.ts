import produce from 'immer';
import { StrictPortMapping, StrictService } from '../normalize';

function _makeWith<T>(inst: T) {
    return (transformer: (instance: T) => T) => transformer(inst);
}

function _makeWhen<T>(inst: T) {
    return (condition: boolean, transformer: (instance: T) => T) =>
        condition ? transformer(inst) : inst;
}

interface ServiceRegistration {
    name?: string;
    service: StrictService;
}

class FluentService {
    constructor(public readonly data: ServiceRegistration) {}
    with = _makeWith<FluentService>(this);
    when = _makeWhen<FluentService>(this);

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

    image = (image: string) =>
        new FluentService({
            ...this.data,
            service: { ...this.data.service, image },
        });
}

class FluentPort {
    constructor(public readonly data: StrictPortMapping) {}
    with = _makeWith<FluentPort>(this);
    when = _makeWhen<FluentPort>(this);

    as = (published: number) => new FluentPort({ ...this.data, published });
    udp = () => new FluentPort({ ...this.data, protocol: 'udp' });
    tcp = () => new FluentPort({ ...this.data, protocol: 'tcp' });
    host = () => new FluentPort({ ...this.data, mode: 'host' });
    ingress = () => new FluentPort({ ...this.data, mode: 'ingress' });
}

const ServiceFactory = (name?: string) =>
    new FluentService({ service: {}, name });

const PortFactory = (
    target: number,
    protocol?: StrictPortMapping['protocol']
) => new FluentPort({ target, protocol });

const swarm = {
    Service: ServiceFactory,
    Port: PortFactory,
};

//----

const srv = swarm
    .Service('redis')
    .image('redis:latest')
    .env('HELLO', 'world')
    .when(process.env.NODE_ENV === 'production', (s) =>
        s.env('MODE', 'production')
    )
    .when(process.env.NODE_ENV === 'development', (s) =>
        s.port(swarm.Port(6193).as(16183))
    );
