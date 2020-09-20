export * from './compose-spec';
export * from './helpers/mergeComposeConfigurations';
export * from './helpers/wrap';

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
