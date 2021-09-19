import YAML from 'js-yaml';
import { DefinitionsSecret } from '../compose-spec';
import { _makeSet, _makeWhen, _makeWith } from './common';

export interface SecretRegistration {
    name?: string;
    secret: DefinitionsSecret;
}

export class FluentSecretDefinition {
    constructor(public readonly data: SecretRegistration) {}
    with = _makeWith<FluentSecretDefinition>(this);
    when = _makeWhen<FluentSecretDefinition>(this);
    private set = _makeSet(FluentSecretDefinition);

    text(text: string) {
        return this.with(this.set('secret.data', text));
    }

    json(data: any, indent: number = 2) {
        return this.text(JSON.stringify(data, null, indent));
    }

    yaml(data: any) {
        return this.text(YAML.dump(data));
    }

    file(fileName: string) {
        return this.with(this.set('secret.file', fileName));
    }

    externalName(name: string) {
        return this.with(this.set('secret.external.name', name));
    }
}

export const SecretDefinitionFactory = (name?: string) =>
    new FluentSecretDefinition({ secret: {}, name });
