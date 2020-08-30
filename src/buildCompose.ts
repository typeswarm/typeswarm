import fs from 'fs';
import { basename, join } from 'path';
import YAML from 'yaml';
import {
    ComposeSpecification,
    DefinitionsConfig,
    PropertiesConfigs,
    PropertiesServices,
} from './compose-spec';
import { getHash } from './utils';

export interface BuildComposeResult {
    composeFile: string;
}

export const buildCompose = async (
    spec: ComposeSpecification,
    directory: string
): Promise<BuildComposeResult> => {
    const specWithRotatedConfigs = await processConfigs(spec, directory);
    const composeFile = join(directory, 'docker-compose.yaml');
    const specYaml = YAML.stringify(specWithRotatedConfigs);
    await fs.promises.writeFile(composeFile, specYaml, 'utf8');
    return {
        composeFile,
    };
};

const processSingleConfig = async (
    name: string,
    config: DefinitionsConfig,
    directory: string
): Promise<{ rotatedConfigName: string; rotatedConfigFile: string }> => {
    if (!config.file && !config.data) {
        throw new Error(
            'config.file or config.data is missing in config=' +
                JSON.stringify(config)
        );
    }
    const configContents = config.data
        ? config.data
        : await fs.promises.readFile(config.file as string, 'utf8');

    const hash = getHash(configContents);
    const rotatedConfigFileBaseName = config.data
        ? `${hash}.${name}.config` //TODO: slugify name
        : `${hash}.${basename(config.file as string)}`;

    const rotatedConfigFile = join(directory, rotatedConfigFileBaseName);
    await fs.promises.writeFile(rotatedConfigFile, configContents, 'utf8');

    const rotatedConfigName = `${name}_${hash}`;
    return { rotatedConfigName, rotatedConfigFile };
};

const processConfigs = async (
    spec: ComposeSpecification,
    directory: string
): Promise<ComposeSpecification> => {
    const { configs = {}, services = {} } = spec;
    const rotatedConfigs: PropertiesConfigs = {};
    const rotatedServices: PropertiesServices = {};

    const rotationMap: { [configName: string]: string } = {};

    for (const [name, config] of Object.entries(configs)) {
        if (config.name || config.external || !(config.file || config.data)) {
            rotatedConfigs[name] = config;
            continue;
        }
        const {
            rotatedConfigName,
            rotatedConfigFile,
        } = await processSingleConfig(name, config, directory);
        rotatedConfigs[rotatedConfigName] = {
            ...config,
            file: rotatedConfigFile,
        };
        delete rotatedConfigs[rotatedConfigName].data;
        rotationMap[name] = rotatedConfigName;
    }

    for (const [name, service] of Object.entries(services)) {
        const { configs: configReferences = [] } = service;
        const rotatedConfigReferences: typeof configReferences = [];
        for (const configReference of configReferences) {
            if (
                typeof configReference === 'object' &&
                configReference.source &&
                rotationMap[configReference.source]
            ) {
                rotatedConfigReferences.push({
                    ...configReference,
                    source: rotationMap[configReference.source],
                });
            } else {
                rotatedConfigReferences.push(configReference);
            }
        }
        rotatedServices[name] = {
            ...service,
            configs: rotatedConfigReferences,
        };
        if (rotatedConfigReferences.length === 0) {
            delete rotatedServices[name].configs;
        }
    }
    return {
        ...spec,
        configs: rotatedConfigs,
        services: rotatedServices,
    };
};
