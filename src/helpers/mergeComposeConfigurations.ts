import { ComposeSpecification } from '../compose-spec';

export const mergeComposeConfigurations = (
    spec1: ComposeSpecification,
    spec2: ComposeSpecification
): ComposeSpecification => {
    return {
        ...spec1,
        version: spec2.version || spec1.version,
        configs: {
            ...(spec1.configs ?? {}),
            ...(spec2.configs ?? {}),
        },
        networks: {
            ...(spec1.networks ?? {}),
            ...(spec2.networks ?? {}),
        },
        secrets: {
            ...(spec1.secrets ?? {}),
            ...(spec2.secrets ?? {}),
        },
        services: {
            ...(spec1.services ?? {}),
            ...(spec2.services ?? {}),
        },
        volumes: {
            ...(spec1.volumes ?? {}),
            ...(spec2.volumes ?? {}),
        },
    };
};
