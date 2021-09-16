import produce from 'immer';
import { set } from 'lodash';
import { DefinitionsVolume } from '../compose-spec';
import { _makeWhen, _makeWith } from './common';

export interface VolumeRegistration {
    name?: string;
    volume: DefinitionsVolume | null;
}

export class FluentVolumeDefinition {
    constructor(public readonly data: VolumeRegistration) {}
    with = _makeWith<FluentVolumeDefinition>(this);
    when = _makeWhen<FluentVolumeDefinition>(this);

    driver = (driver: string) =>
        new FluentVolumeDefinition(
            produce(this.data, (data) => {
                set(data, 'volume.driver', driver);
            })
        );

    driverOpts = (driverOpts: Record<string, string | number>) =>
        new FluentVolumeDefinition(
            produce(this.data, (data) => {
                set(data, 'volume.driver_opts', driverOpts);
            })
        );
}

export const VolumeDefinitionFactory = (name?: string) =>
    new FluentVolumeDefinition({ name, volume: null });
