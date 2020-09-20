import { ComposeSpecification } from '../compose-spec';
import { StrictSpecification, parseSpecification } from '../normalize';

export const mergeComposeConfigurations = (
    spec1: ComposeSpecification,
    spec2: ComposeSpecification
): StrictSpecification => {
    const strictSpec1 = parseSpecification(spec1);
    const strictSpec2 = parseSpecification(spec2);

    return {
        ...strictSpec1,
        version: strictSpec2.version || strictSpec1.version,
        configs: {
            ...(strictSpec1.configs ?? {}),
            ...(strictSpec2.configs ?? {}),
        },
        networks: {
            ...(strictSpec1.networks ?? {}),
            ...(strictSpec2.networks ?? {}),
        },
        secrets: {
            ...(strictSpec1.secrets ?? {}),
            ...(strictSpec2.secrets ?? {}),
        },
        services: {
            ...(strictSpec1.services ?? {}),
            ...(strictSpec2.services ?? {}),
        },
        volumes: {
            ...(strictSpec1.volumes ?? {}),
            ...(strictSpec2.volumes ?? {}),
        },
    };
};
