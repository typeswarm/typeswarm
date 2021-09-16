export * from './compose-spec';
export * from './helpers/mergeComposeConfigurations';
export * from './helpers/wrap';
export * from './fluent/swarm';

declare module './compose-spec' {
    interface DefinitionsConfig {
        /**
         * [TypeSwarm extension] Raw data of config file
         */
        data?: string;
    }

    interface DefinitionsSecret {
        /**
         * [TypeSwarm extension] Raw data of secret file
         */
        data?: string;
    }
}
