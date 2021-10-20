import { ok } from 'assert';
import { StrictNetwork } from '../normalize';
import { _makeProduce, _makeSet, _makeWhen, _makeWith } from './common';
import { BaseFluentServiceNetwork } from './generated/BaseFluentServiceNetwork';
import { FluentNetworkDefinition } from './network';

export class FluentServiceNetwork extends BaseFluentServiceNetwork {
    with = _makeWith<FluentServiceNetwork>(this);
    when = _makeWhen<FluentServiceNetwork>(this);
}

export const ServiceNetworkFactory = (
    networkOrItsName: string | FluentNetworkDefinition
) => {
    const name =
        typeof networkOrItsName === 'string'
            ? networkOrItsName
            : networkOrItsName.data.name;

    ok(name, 'Network name is required');

    return new FluentServiceNetwork({
        name,
        network: null,
    });
};
