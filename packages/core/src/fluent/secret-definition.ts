import YAML from 'js-yaml';
import { DefinitionsSecret } from '../compose-spec';
import { _makeSet, _makeWhen, _makeWith } from './common';
import { BaseFluentSecretDefinition } from './generated/BaseFluentSecretDefinition';

export interface SecretRegistration {
    name?: string;
    secret: DefinitionsSecret;
}

export class FluentSecretDefinition extends BaseFluentSecretDefinition {
    with = _makeWith<FluentSecretDefinition>(this);
    when = _makeWhen<FluentSecretDefinition>(this);

    json(data: any, indent: number = 2) {
        return this.text(JSON.stringify(data, null, indent));
    }

    yaml(data: any) {
        return this.text(YAML.dump(data));
    }

    external(flagOrName: boolean | string | void) {
        if (typeof flagOrName === 'string') {
            return this.strExternal(flagOrName);
        }
        if (typeof flagOrName === 'boolean') {
            return this.boolExternal(flagOrName);
        }
        if (typeof flagOrName === 'undefined') {
            return this.boolExternal(true);
        }
    }
}

export const SecretDefinitionFactory = (name?: string) =>
    new FluentSecretDefinition({ secret: {}, name });
