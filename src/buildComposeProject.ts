import fs from 'fs';
import { join } from 'path';
import YAML from 'yaml';
import { ComposeSpecification } from './compose-spec';
import { rotateEntities } from './rotateEntities';

export interface BuildComposeResult {
    composeFile: string;
}

export const buildComposeProject = async (
    spec: ComposeSpecification,
    directory: string
): Promise<BuildComposeResult> => {
    const specWithRotatedConfigs = await rotateEntities(
        'configs',
        spec,
        directory
    );
    const composeFile = join(directory, 'docker-compose.yaml');
    const specYaml = YAML.stringify(specWithRotatedConfigs);
    await fs.promises.writeFile(composeFile, specYaml, 'utf8');
    return {
        composeFile,
    };
};
