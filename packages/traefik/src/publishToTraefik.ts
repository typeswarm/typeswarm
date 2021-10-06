import { FluentService } from '@typeswarm/core/lib/fluent/service';
import { swarm } from '@typeswarm/core';
import { CERT_RESOLVER } from './constants';

export interface PublishToTraefikOptions {
    serviceName: string;
    host: string;
    port: number;
    externalNetwork?: string;
    externalHttps?: boolean;
    internalHttps?: boolean;
}

const label = (key: string, value: string | number) => (
    service: FluentService
) => service.with(service.set(['service', 'deploy', 'labels', key], value));

export const publishToTraefik = ({
    host,
    port,
    serviceName,
    externalHttps = true,
    externalNetwork,
    internalHttps = false,
}: PublishToTraefikOptions) => (service: FluentService): FluentService => {
    return service
        .when(externalNetwork, (_, externalNetwork) =>
            _.network(swarm.ServiceNetwork(externalNetwork))
        )
        .with(label('traefik.enable', 'true'))
        .with(
            label(
                `traefik.http.services.${serviceName}.loadbalancer.server.port`,
                port
            )
        )
        .with(
            label(
                `traefik.http.routers.${serviceName}.tls.certresolver`,
                CERT_RESOLVER
            )
        )
        .with(
            label(
                `traefik.http.routers.${serviceName}.entrypoints`,
                externalHttps ? 'websecure' : 'web'
            )
        )
        .with(
            label(
                `traefik.http.services.${serviceName}.loadbalancer.server.scheme`,
                internalHttps ? 'https' : 'http'
            )
        )
        .with(
            label(
                `traefik.http.routers.${serviceName}.rule`,
                `Host(\`${host}\`)`
            )
        )
        .when(externalNetwork, (_, externalNetwork) =>
            _.with(label('traefik.docker.network', externalNetwork)).network(
                swarm.ServiceNetwork(externalNetwork)
            )
        );
};
