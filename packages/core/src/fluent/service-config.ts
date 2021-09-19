import { ok } from 'assert';
import { StrictConfig } from '../normalize';
import { _makeSet, _makeWhen, _makeWith } from './common';
import { FluentConfigDefinition } from './config-definition';
import { FluentSecretDefinition } from './secret-definition';

export class FluentServiceConfig {
    constructor(public readonly data: StrictConfig) {}
    with = _makeWith<FluentServiceConfig>(this);
    when = _makeWhen<FluentServiceConfig>(this);
    private set = _makeSet(FluentServiceConfig);

    source = (
        source: string | FluentConfigDefinition | FluentSecretDefinition
    ) => {
        const src = typeof source === 'string' ? source : source.data.name;
        ok(src, 'Source config/secret name is not set');
        return this.with(this.set('source', src));
    };

    uid = (uid: string) => this.with(this.set('uid', uid));
    gid = (gid: string) => this.with(this.set('gid', gid));
    mode = (mode: number) => this.with(this.set('mode', mode));
}

export const ServiceConfigFactory = (target: string) =>
    new FluentServiceConfig({ target });
