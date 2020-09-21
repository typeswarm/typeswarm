import { DefinitionsService, ComposeSpecification } from '../compose-spec';
import {
    StrictService,
    parseService,
    StrictSpecification,
    parseSpecification,
} from '../normalize';
import { flattenDeep, RecursiveArray } from 'lodash';

export type Plugin<T> = (input: T) => T;

export interface Wrapped<T> {
    with(...plugins: RecursiveArray<Plugin<T>>): Wrapped<T>;
    value(): T;
}

export function wrap<T>(input: T): Wrapped<T> {
    const registeredPlugins: Plugin<T>[] = [];

    return {
        with(...plugins) {
            registeredPlugins.push(...flattenDeep(plugins));
            return this;
        },
        value() {
            return registeredPlugins.reduce(
                (input, plugin) => plugin(input),
                input
            );
        },
    };
}

export function wrapService(
    service: DefinitionsService
): Wrapped<StrictService> {
    return wrap<StrictService>(parseService(service));
}

export function wrapSpecification(
    spec: ComposeSpecification
): Wrapped<StrictSpecification> {
    return wrap<StrictSpecification>(parseSpecification(spec));
}
