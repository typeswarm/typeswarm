import { ok } from 'assert';
import { get } from 'lodash';
import { StrictSpecification } from '../normalize';
import { _makeSet, _makeWhen, _makeWith } from './common';
import { FluentConfigDefinition } from './config-definition';
import { FluentNetworkDefinition } from './network';
import { FluentSecretDefinition } from './secret-definition';
import { FluentService } from './service';
import { propset } from './utils';
import { FluentVolumeDefinition } from './volume-definition';

export class FluentCluster {
    constructor(public readonly data: StrictSpecification) {}
    with = _makeWith<FluentCluster>(this);
    when = _makeWhen<FluentCluster>(this);
    private set = _makeSet(FluentCluster);

    version = (version: string) => this.with(this.set('version', version));

    service = (service: FluentService) => {
        const name = service.data.name;
        ok(name, 'Service name is required');
        return this.with(this.set(['services', name], service.data.service));
    };

    volume = (volume: FluentVolumeDefinition) => {
        const name = volume.data.name;
        ok(name, 'Volume name is required');
        return this.with(this.set(['volumes', name], volume.data.volume));
    };

    config = (config: FluentConfigDefinition) => {
        const name = config.data.name;
        ok(name, 'Config name is required');
        return this.with(this.set(['configs', name], config.data.config));
    };

    secret = (secret: FluentSecretDefinition) => {
        const name = secret.data.name;
        ok(name, 'Secret name is required');
        return this.with(this.set(['secrets', name], secret.data.secret));
    };

    network = (network: FluentNetworkDefinition) => {
        const name = network.data.name;
        ok(name, 'Network name is required');
        return this.with(this.set(['networks', name], network.data.network));
    };
}

export const ClusterFactory = (version: string = '3.8') =>
    new FluentCluster({ version });
