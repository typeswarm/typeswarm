import { ClusterFactory } from './cluster';
import { ImageFactory } from './image';
import { PortFactory } from './port';
import { ServiceFactory } from './service';
import { ServiceVolumeFactory } from './service-volume';
import { VolumeDefinitionFactory } from './volume-definition';

export const swarm = {
    Service: ServiceFactory,
    Port: PortFactory,
    Image: ImageFactory,
    ServiceVolume: ServiceVolumeFactory,
    Volume: VolumeDefinitionFactory,
    Cluster: ClusterFactory,
};

export * from './cluster';
export * from './image';
export * from './port';
export * from './service';
export * from './service-volume';
export * from './volume-definition';
