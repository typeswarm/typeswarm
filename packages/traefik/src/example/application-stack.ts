import { swarm } from '@typeswarm/core';
import { publishToTraefik } from '../publishToTraefik';

const conf = {
    dbHost: 'db',
    dbUser: 'exampleuser',
    dbPass: 'wyv9whew79etvg89JOI023gfbF',
    dbName: 'exampledb',
    domain: 'wp.example.com',
};

const volWordpress = swarm.Volume('wordpress');
const volDb = swarm.Volume('db');

const wordpress = swarm
    .Service('wordpress')
    .image(swarm.Image('wordpress'))
    .env('WORDPRESS_DB_HOST', conf.dbHost)
    .env('WORDPRESS_DB_USER', conf.dbUser)
    .env('WORDPRESS_DB_PASSWORD', conf.dbPass)
    .env('WORDPRESS_DB_NAME', conf.dbName)
    .volume(swarm.ServiceVolume('/var/www/html').source(volWordpress))
    .with(
        publishToTraefik({
            host: conf.domain,
            port: 80,
            serviceName: 'wordpress',
            externalHttps: true,
            externalNetwork: 'shared_proxy',
        })
    );

const db = swarm
    .Service('db')
    .image(swarm.Image('myswql').tag('5.7'))
    .env('MYSQL_DATABASE', conf.dbName)
    .env('MYSQL_USER', conf.dbUser)
    .env('MYSQL_PASSWORD', conf.dbPass)
    .env('MYSQL_RANDOM_ROOT_PASSWORD', '1')
    .volume(swarm.ServiceVolume('/var/lib/mysql').source(volDb));

const spec = swarm
    .Cluster()
    .service(db)
    .service(db)
    .service(wordpress).data;

export { spec };
