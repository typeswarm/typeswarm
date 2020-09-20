import _ from 'lodash';
import { ComposeSpecification } from '../compose-spec';
import { StrictSpecification } from './models';
import { parseService } from './parseService';

export function parseSpecification(
    spec: ComposeSpecification
): StrictSpecification {
    return {
        ...spec,
        services: spec.services
            ? _(spec.services)
                  .mapValues((s) => parseService(s))
                  .value()
            : undefined,
    };
}
