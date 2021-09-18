import { DefinitionsService } from '../compose-spec';
import { StrictConfig } from './models';

export function parseConfigs(
    configs: DefinitionsService['configs'] | DefinitionsService['secrets']
): StrictConfig[] | undefined {
    if (!configs) {
        return undefined;
    }
    return configs.map(parseConfig);
}

function parseConfig(config: StrictConfig | string): StrictConfig {
    if (typeof config === 'string') {
        return {
            source: config,
            target: `/${config}`,
        };
    }
    return config;
}
