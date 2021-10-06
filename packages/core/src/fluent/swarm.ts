import { ClusterFactory } from './cluster';
import { ConfigDefinitionFactory } from './config-definition';
import { ImageFactory } from './image';
import { NetworkDefinitionFactory } from './network';
import { PortFactory } from './port';
import { SecretDefinitionFactory } from './secret-definition';
import { ServiceFactory } from './service';
import { ServiceConfigFactory } from './service-config';
import { ServiceNetworkFactory } from './service-network';
import { ServiceVolumeFactory } from './service-volume';
import { VolumeDefinitionFactory } from './volume-definition';

export const swarm = {
    Service: ServiceFactory,
    Port: PortFactory,
    Image: ImageFactory,
    ServiceVolume: ServiceVolumeFactory,
    ServiceConfig: ServiceConfigFactory,
    ServiceNetwork: ServiceNetworkFactory,
    Volume: VolumeDefinitionFactory,
    Config: ConfigDefinitionFactory,
    Secret: SecretDefinitionFactory,
    Network: NetworkDefinitionFactory,
    Cluster: ClusterFactory
};
export {
    ServiceFactory as Service,
    PortFactory as Port,
    ImageFactory as Image,
    ServiceVolumeFactory as ServiceVolume,
    ServiceConfigFactory as ServiceConfig,
    ServiceNetworkFactory as ServiceNetwork,
    VolumeDefinitionFactory as Volume,
    ConfigDefinitionFactory as Config,
    SecretDefinitionFactory as Secret,
    NetworkDefinitionFactory as Network,
    ClusterFactory as Cluster
};
