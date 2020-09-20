import { DefinitionsService, ComposeSpecification } from '../compose-spec';
import {
    StrictService,
    parseService,
    StrictSpecification,
    parseSpecification,
} from '../normalize';

export interface Wrapped<T> {
    with(plugin: (input: T) => T): Wrapped<T>;
    value(): T;
}

export function wrap<T>(input: T): Wrapped<T> {
    const plugins: ((input: T) => T)[] = [];

    return {
        with(plugin) {
            plugins.push(plugin);
            return this;
        },
        value() {
            return plugins.reduce((input, plugin) => plugin(input), input);
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
