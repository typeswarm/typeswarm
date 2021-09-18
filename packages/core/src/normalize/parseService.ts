import { DefinitionsService } from '../compose-spec';
import { StrictService } from './models';
import { parseListOrDict } from './parseListOrDict';
import { parsePorts } from './parsePorts';
import { parseVolumes } from './parseVolumes';
import { parseConfigs } from './parseConfigs';
import { parseNetworks } from './parseNetworks';
import { parseDeployment } from './parseDeployment';

export function parseService(service: DefinitionsService): StrictService {
    return {
        ...service,
        deploy: parseDeployment(service.deploy),
        environment: parseListOrDict(service.environment),
        labels: parseListOrDict(service.labels),
        ports: parsePorts(service.ports),
        volumes: parseVolumes(service.volumes),
        configs: parseConfigs(service.configs),
        secrets: parseConfigs(service.secrets),
        networks: parseNetworks(service.networks),
    };
}
