import fs from 'fs';
import { join } from 'path';
import YAML from 'yaml';
import { ComposeSpecification } from './compose-spec';
import { rotateEntities } from './rotateEntities';
import { Logger } from 'tslog';

export const COMPOSE_FILE_NAME = 'docker-compose.yaml';

export interface BuildComposeResult {
    composeFile: string;
}

export const buildComposeProject = async (
    spec: ComposeSpecification,
    directory: string,
    logger: Logger
): Promise<BuildComposeResult> => {
    const specWithRotatedConfigs = await rotateEntities(
        'configs',
        spec,
        directory,
        logger
    );
    const specWithRotatedSecrets = await rotateEntities(
        'secrets',
        specWithRotatedConfigs,
        directory,
        logger
    );
    const composeFile = join(directory, COMPOSE_FILE_NAME);
    const specYaml = YAML.stringify(
        JSON.parse(JSON.stringify(specWithRotatedSecrets))
    );
    logger.info('Write file', composeFile);
    await fs.promises.writeFile(composeFile, specYaml, 'utf8');
    return {
        composeFile,
    };
};
