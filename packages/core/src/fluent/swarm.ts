import { ClusterFactory } from './cluster';
import { ConfigDefinitionFactory } from './config-definition';
import { ImageFactory } from './image';
import { PortFactory } from './port';
import { SecretDefinitionFactory } from './secret-definition';
import { ServiceFactory } from './service';
import { ServiceConfigFactory } from './service-config';
import { ServiceVolumeFactory } from './service-volume';
import { VolumeDefinitionFactory } from './volume-definition';

export const swarm = {
    Service: ServiceFactory,
    Port: PortFactory,
    Image: ImageFactory,
    ServiceVolume: ServiceVolumeFactory,
    ServiceConfig: ServiceConfigFactory,
    Volume: VolumeDefinitionFactory,
    Config: ConfigDefinitionFactory,
    Secret: SecretDefinitionFactory,
    Cluster: ClusterFactory
};
export {
    ServiceFactory as Service,
    PortFactory as Port,
    ImageFactory as Image,
    ServiceVolumeFactory as ServiceVolume,
    ServiceConfigFactory as ServiceConfig,
    VolumeDefinitionFactory as Volume,
    ConfigDefinitionFactory as Config,
    SecretDefinitionFactory as Secret,
    ClusterFactory as Cluster
};
