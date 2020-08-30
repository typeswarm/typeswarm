import fs from 'fs';
import { basename, join } from 'path';
import YAML from 'yaml';
import {
    ComposeSpecification,
    DefinitionsConfig,
    PropertiesConfigs,
    PropertiesServices,
    DefinitionsSecret,
} from './compose-spec';
import { getHash } from './utils';

const rotateSingleEntity = async (
    name: string,
    entity: DefinitionsConfig | DefinitionsSecret,
    directory: string
): Promise<{ rotatedEntityName: string; rotatedEntityFile: string }> => {
    if (!entity.file && !entity.data) {
        throw new Error(
            '.file or .data is missing in ' + JSON.stringify(entity)
        );
    }
    //TODO: support raw binary data
    const contents = entity.data
        ? entity.data
        : await fs.promises.readFile(entity.file as string, 'utf8');

    const hash = getHash(contents);
    const rotatedEntityFileBaseName = entity.data
        ? `${hash}.${name}.config` //TODO: slugify name
        : `${hash}.${basename(entity.file as string)}`;

    const rotatedEntityFile = join(directory, rotatedEntityFileBaseName);
    //TODO: support raw binary data
    await fs.promises.writeFile(rotatedEntityFile, contents, 'utf8');

    const rotatedEntityName = `${name}_${hash}`;
    return {
        rotatedEntityName: rotatedEntityName,
        rotatedEntityFile: rotatedEntityFile,
    };
};

export const rotateEntities = async (
    entity: 'secrets' | 'configs',
    spec: ComposeSpecification,
    directory: string
): Promise<ComposeSpecification> => {
    const {
        //secrets or configs
        [entity]: entitiesMap = {},
        services = {},
    } = spec;
    const rotatedEntities: PropertiesConfigs = {};
    const rotatedServices: PropertiesServices = {};

    const rotationMap: { [configName: string]: string } = {};

    for (const [name, config] of Object.entries(entitiesMap)) {
        if (config.name || config.external || !(config.file || config.data)) {
            rotatedEntities[name] = config;
            continue;
        }
        const {
            rotatedEntityName: rotatedEntityName,
            rotatedEntityFile: rotatedEntityFile,
        } = await rotateSingleEntity(name, config, directory);
        rotatedEntities[rotatedEntityName] = {
            ...config,
            file: rotatedEntityFile,
        };
        delete rotatedEntities[rotatedEntityName].data;
        rotationMap[name] = rotatedEntityName;
    }

    for (const [name, service] of Object.entries(services)) {
        const {
            //service.configs or service.secrets
            [entity]: entityReferences = [],
        } = service;
        const rotatedEntityReferences: typeof entityReferences = [];
        for (const entityRef of entityReferences) {
            if (
                typeof entityRef === 'object' &&
                entityRef.source &&
                rotationMap[entityRef.source]
            ) {
                rotatedEntityReferences.push({
                    ...entityRef,
                    source: rotationMap[entityRef.source],
                });
            } else {
                rotatedEntityReferences.push(entityRef);
            }
        }
        rotatedServices[name] = {
            ...service,
            [entity]: rotatedEntityReferences,
        };
        if (rotatedEntityReferences.length === 0) {
            delete rotatedServices[name][entity];
        }
    }
    return {
        ...spec,
        [entity]: rotatedEntities,
        services: rotatedServices,
    };
};
