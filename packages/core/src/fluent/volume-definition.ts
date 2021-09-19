import { DefinitionsVolume } from '../compose-spec';
import { _makeSet, _makeWhen, _makeWith } from './common';

export interface VolumeRegistration {
    name?: string;
    volume: DefinitionsVolume | null;
}

export class FluentVolumeDefinition {
    constructor(public readonly data: VolumeRegistration) {}
    with = _makeWith<FluentVolumeDefinition>(this);
    when = _makeWhen<FluentVolumeDefinition>(this);
    private set = _makeSet(FluentVolumeDefinition);

    driver = (driver: string) => this.with(this.set('volume.driver', driver));

    driverOpts = (driverOpts: Record<string, string | number>) =>
        this.with(this.set('volume.driver_opts', driverOpts));
}

export const VolumeDefinitionFactory = (name?: string) =>
    new FluentVolumeDefinition({ name, volume: null });
