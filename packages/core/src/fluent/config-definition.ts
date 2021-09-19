import YAML from 'js-yaml';
import { DefinitionsConfig } from '../compose-spec';
import { _makeSet, _makeWhen, _makeWith } from './common';

export interface ConfigRegistration {
    name?: string;
    config: DefinitionsConfig;
}

export class FluentConfigDefinition {
    constructor(public readonly data: ConfigRegistration) {}
    with = _makeWith<FluentConfigDefinition>(this);
    when = _makeWhen<FluentConfigDefinition>(this);
    private set = _makeSet(FluentConfigDefinition);

    text(text: string) {
        return this.with(this.set('config.data', text));
    }

    json(data: any, indent: number = 2) {
        return this.text(JSON.stringify(data, null, indent));
    }

    yaml(data: any) {
        return this.text(YAML.dump(data));
    }

    file(fileName: string) {
        return this.with(this.set('config.file', fileName));
    }

    externalName(name: string) {
        return this.with(this.set('config.external.name', name));
    }
}

export const ConfigDefinitionFactory = (name?: string) =>
    new FluentConfigDefinition({ config: {}, name });
