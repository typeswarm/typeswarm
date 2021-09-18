import { DefinitionsDeployment } from '../compose-spec';
import { StrictDeployment } from './models';
import { parseListOrDict } from './parseListOrDict';

export function parseDeployment(
    deploy: DefinitionsDeployment | null | undefined
): StrictDeployment | undefined {
    if (!deploy) {
        return undefined;
    }
    return { ...deploy, labels: parseListOrDict(deploy.labels) };
}
