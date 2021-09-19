import { ComposeSpecification } from '@typeswarm/core';
import { parseSpecification } from '@typeswarm/core/lib/normalize';
import { inject, injectable } from 'inversify';
import { join } from 'path';
import { Logger } from 'tslog';
import YAML from 'yaml';
import { Types } from './di';
import { EntitiesProcessor } from './EntitiesProcessor';
import { IFileStorage } from './FileStorage';

export const COMPOSE_FILE_NAME = 'docker-compose.yaml';

@injectable()
export class ComposeBuilder {
    constructor(
        @inject(Types.Logger)
        private logger: Logger,

        @inject(Types.EntitiesProcessor)
        private entitiesProcessor: EntitiesProcessor,

        @inject(Types.IFileStorage)
        private fs: IFileStorage
    ) {}

    async build(spec: ComposeSpecification, directory: string) {
        const strictSpec = parseSpecification(spec);
        const specWithRotatedConfigs = await this.entitiesProcessor.processEntities(
            'configs',
            strictSpec,
            directory
        );
        const specWithRotatedSecrets = await this.entitiesProcessor.processEntities(
            'secrets',
            specWithRotatedConfigs,
            directory
        );
        const composeFile = join(directory, COMPOSE_FILE_NAME);
        const specYaml = YAML.stringify(
            JSON.parse(JSON.stringify(specWithRotatedSecrets))
        );
        this.logger.info('Write file', composeFile);
        await this.fs.write(composeFile, specYaml);
    }
}
