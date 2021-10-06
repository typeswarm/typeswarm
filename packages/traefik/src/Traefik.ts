import { CERT_RESOLVER } from './constants';
import { FluentCluster } from '@typeswarm/core/lib/fluent/cluster';
import { swarm } from '@typeswarm/core';

export interface TraefikOptions {
    debug?: boolean;
    serviceName?: string;
    image?: string;
    tag?: string;
    https?: boolean;
    letsencryptEmail?: string;
    exposeDashboard?: boolean;
    externalNetwork?: string;
    letsencryptVolume?: string;
}

export const Traefik = ({
    debug = false,
    serviceName = 'traefik',
    image = 'traefik',
    tag = 'v2.2',
    https = true,
    letsencryptEmail,
    exposeDashboard = false,
    externalNetwork,
    letsencryptVolume = 'traefik_letsencrypt_data',
}: TraefikOptions) => (stack: FluentCluster): FluentCluster => {
    if (https && !letsencryptEmail) {
        throw new Error('letsencryptEmail is required for https');
    }

    const vol = swarm.Volume(letsencryptVolume);

    const net = externalNetwork
        ? swarm.Network(externalNetwork).external()
        : null;

    const traefikService = swarm
        .Service(serviceName)
        .image(swarm.Image(image).tag(tag))
        .port(swarm.Port(80).as(80))
        .when(https, (_) => _.port(swarm.Port(443).as(443)))
        .when(exposeDashboard, (_) => _.port(swarm.Port(8080).as(8080)))
        .when(net, (_, net) => _.network(swarm.ServiceNetwork(net)))
        .command([
            '--api.insecure=true',
            '--providers.docker=true',
            '--providers.docker.swarmMode=true',
            '--providers.docker.watch=true',
            '--providers.docker.exposedbydefault=false',
            '--entrypoints.web.address=:80',
        ])
        .when(https, (_) =>
            _.command([
                '--entrypoints.websecure.address=:443',
                `--certificatesresolvers.${CERT_RESOLVER}.acme.httpchallenge=true`,
                `--certificatesresolvers.${CERT_RESOLVER}.acme.httpchallenge.entrypoint=web`,
                `--certificatesresolvers.${CERT_RESOLVER}.acme.caserver=https://acme-v02.api.letsencrypt.org/directory`,
                `--certificatesresolvers.${CERT_RESOLVER}.acme.storage=/letsencrypt/acme.json`,
            ])
        )
        .when(!!(letsencryptEmail && https), (_) =>
            _.command(
                `--certificatesresolvers.${CERT_RESOLVER}.acme.email=${letsencryptEmail}`
            )
        )
        .when(debug, (_) => _.command('--log.level=DEBUG'))
        .volume(swarm.ServiceVolume('/letsencrypt').source(vol));

    return stack.service(traefikService).volume(vol);
};
