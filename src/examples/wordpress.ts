import { ComposeSpecification, DefinitionsService } from '../enxame';
import { config as reverseProxyConfig } from './reverse-proxy-config';

const volDBData = 'db_data';
const mysqlRootPassword = 'somewordpress';
const mysqlDatabase = 'wordpress';
const mysqlUser = 'wordpress';
const mysqlPassword = 'wordpress';

const wordpress: DefinitionsService = {
    image: 'wordpress:latest',
    ports: [{ published: 11800, target: 80 }],
    environment: {
        WORDPRESS_DB_HOST: 'db',
        WORDPRESS_DB_USER: mysqlUser,
        WORDPRESS_DB_PASSWORD: mysqlPassword,
        WORDPRESS_DB_NAME: mysqlDatabase,
    },
    configs: [
        {
            source: 'exampleConfig',
            target: '/helloworld.json',
        },
    ],
};

const db: DefinitionsService = {
    image: 'mysql:8.0.19',
    command: '--default-authentication-plugin=mysql_native_password',
    volumes: [
        {
            type: 'volume',
            source: volDBData,
            target: '/var/lib/mysql',
        },
    ],
    environment: {
        MYSQL_ROOT_PASSWORD: mysqlRootPassword,
        MYSQL_DATABASE: mysqlDatabase,
        MYSQL_USER: mysqlUser,
        MYSQL_PASSWORD: mysqlPassword,
    },
};

const nginx: DefinitionsService = {
    image: 'nginx',
    ports: [{ published: 80, target: 80 }],
    configs: [
        {
            source: 'reverseProxy',
            target: '/etc/nginx/nginx.conf',
        },
    ],
};

const spec: ComposeSpecification = {
    version: '3.7',
    services: {
        wordpress,
        db,
        nginx,
    },
    volumes: {
        [volDBData]: null,
    },
    configs: {
        reverseProxy: {
            data: reverseProxyConfig,
        },
        exampleConfig: {
            file: `${__dirname}/example-config.json`,
        },
        exampleDynamicConfig: {
            data: JSON.stringify({
                hi: 'universe',
            }),
        },
    },
};

export { spec };
