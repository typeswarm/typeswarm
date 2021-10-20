import { ok } from 'assert';
import { _makeSet, _makeWhen, _makeWith } from './common';
import { FluentConfigDefinition } from './config-definition';
import { BaseFluentServiceConfig } from './generated/BaseFluentServiceConfig';
import { FluentSecretDefinition } from './secret-definition';
import { propset } from './utils';

export class FluentServiceConfig extends BaseFluentServiceConfig {
    with = _makeWith<FluentServiceConfig>(this);
    when = _makeWhen<FluentServiceConfig>(this);

    source = (
        source: string | FluentConfigDefinition | FluentSecretDefinition
    ) => {
        const src = typeof source === 'string' ? source : source.data.name;
        ok(src, 'Source config/secret name is not set');
        return propset(this, 'data.source', src);
    };
}

export const ServiceConfigFactory = (target: string) =>
    new FluentServiceConfig({ target });
