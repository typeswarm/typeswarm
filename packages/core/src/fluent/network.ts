import { _makeProduce, _makeSet, _makeWhen, _makeWith } from './common';
import { BaseFluentNetwork } from './generated/BaseFluentNetwork';

export class FluentNetworkDefinition extends BaseFluentNetwork {
    with = _makeWith<FluentNetworkDefinition>(this);
    when = _makeWhen<FluentNetworkDefinition>(this);

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

export const NetworkDefinitionFactory = (name?: string) =>
    new FluentNetworkDefinition({ name, network: {} });
