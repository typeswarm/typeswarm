import { swarm } from '@typeswarm/core';
import { Traefik } from '..';

export const spec = swarm.Cluster().with(
    Traefik({
        debug: true,
        https: true,
        letsencryptEmail: 'example@example.com',
    })
).data;
