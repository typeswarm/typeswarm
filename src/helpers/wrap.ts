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
