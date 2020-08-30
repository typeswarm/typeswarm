export * from './compose-spec';

declare module './compose-spec' {
    interface DefinitionsConfig {
        /**
         * [Enxame extension] Raw data of config file
         */
        data?: string;
    }

    interface DefinitionsSecret {
        /**
         * [Enxame extension] Raw data of secret file
         */
        data?: string;
    }
}
