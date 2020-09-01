import fs from 'fs';
import { inject, injectable } from 'inversify';
import { join } from 'path';
import { Logger } from 'tslog';
import YAML from 'yaml';
import { ComposeSpecification } from './compose-spec';
import { Types } from './di';
import { EntitiesProcessor } from './EntitiesProcessor';

export const COMPOSE_FILE_NAME = 'docker-compose.yaml';

@injectable()
export class ComposeBuilder {
    constructor(
        @inject(Types.Logger)
        private logger: Logger,

        @inject(Types.EntitiesProcessor)
        private entitiesProcessor: EntitiesProcessor
    ) {}

    async build(spec: ComposeSpecification, directory: string) {
        const specWithRotatedConfigs = await this.entitiesProcessor.processEntities(
            'configs',
            spec,
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
        await fs.promises.writeFile(composeFile, specYaml, 'utf8');
    }
}
