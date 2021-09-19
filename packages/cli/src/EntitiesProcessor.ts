import 'reflect-metadata';

import {
    DefinitionsConfig,
    DefinitionsSecret,
    PropertiesConfigs,
} from '@typeswarm/core';
import {
    StrictServicesDict,
    StrictSpecification,
} from '@typeswarm/core/lib/normalize';
import { getHash } from '@typeswarm/core/lib/utils';

import { inject, injectable } from 'inversify';
import { basename, join, relative } from 'path';
import { Logger } from 'tslog';
import { Types } from './di';
import { IFileStorage } from './FileStorage';

@injectable()
export class EntitiesProcessor {
    constructor(
        @inject(Types.Logger)
        private logger: Logger,
        @inject(Types.IFileStorage)
        private fileStorage: IFileStorage
    ) {}

    private async processSingleEntity(
        name: string,
        entity: DefinitionsConfig | DefinitionsSecret,
        directory: string
    ): Promise<{ rotatedEntityName: string; rotatedEntityFile: string }> {
        if (!entity.file && !entity.data) {
            throw new Error(
                '.file or .data is missing in ' + JSON.stringify(entity)
            );
        }
        //TODO: support raw binary data
        const contents = entity.data
            ? entity.data
            : await this.fileStorage.read(entity.file as string);

        const hash = getHash(contents);
        const rotatedEntityFileBaseName = entity.data
            ? `${hash}.${name}.config` //TODO: slugify name
            : `${hash}.${basename(entity.file as string)}`;

        const rotatedEntityFile = join(directory, rotatedEntityFileBaseName);
        this.logger.info('Write file', rotatedEntityFile);
        //TODO: support raw binary data
        await this.fileStorage.write(rotatedEntityFile, contents);

        const rotatedEntityName = `${name}_${hash}`;
        return {
            rotatedEntityName,
            rotatedEntityFile,
        };
    }

    async processEntities(
        entity: 'secrets' | 'configs',
        spec: StrictSpecification,
        directory: string
    ): Promise<StrictSpecification> {
        const {
            //secrets or configs
            [entity]: entitiesMap = {},
            services = {},
        } = spec;
        const rotatedEntities: PropertiesConfigs = {};
        const rotatedServices: StrictServicesDict = {};

        const rotationMap: { [configName: string]: string } = {};

        for (const [name, config] of Object.entries(entitiesMap)) {
            if (
                config.name ||
                config.external ||
                !(config.file || config.data)
            ) {
                rotatedEntities[name] = config;
                continue;
            }
            const {
                rotatedEntityName: rotatedEntityName,
                rotatedEntityFile: rotatedEntityFile,
            } = await this.processSingleEntity(name, config, directory);
            rotatedEntities[rotatedEntityName] = {
                ...config,
                file: relative(directory, rotatedEntityFile),
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
    }
}
