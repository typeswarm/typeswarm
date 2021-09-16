import { ok } from 'assert';
import produce from 'immer';
import { set } from 'lodash';
import { StrictSpecification } from '../normalize';
import { _makeWhen, _makeWith } from './common';
import { FluentService } from './service';
import { FluentVolumeDefinition } from './volume-definition';

export class FluentCluster {
    constructor(public readonly data: StrictSpecification) {}
    with = _makeWith<FluentCluster>(this);
    when = _makeWhen<FluentCluster>(this);

    version = (version: string) => new FluentCluster({ ...this.data, version });

    service = (service: FluentService) => {
        const name = service.data.name;
        ok(name, 'Service name is required');
        return new FluentCluster(
            produce(this.data, (data) => {
                set(data, ['services', name], service.data.service);
            })
        );
    };

    volume = (volume: FluentVolumeDefinition) => {
        const name = volume.data.name;
        ok(name, 'Volume name is required');
        return new FluentCluster(
            produce(this.data, (data) => {
                set(data, ['volumes', name], volume.data.volume);
            })
        );
    };
}

export const ClusterFactory = (version: string = '3.8') =>
    new FluentCluster({ version });
