import { StrictPortMapping } from '../normalize';
import { _makeWhen } from './common';
import { BaseFluentPort } from './generated/BaseFluentPort';

export class FluentPort extends BaseFluentPort {
    when = _makeWhen<FluentPort>(this);
}

export const PortFactory = (
    target: number,
    protocol: StrictPortMapping['protocol'] = 'tcp'
) => new FluentPort({ target, protocol });
