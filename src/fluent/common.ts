export function _makeWith<T>(inst: T) {
    return (transformer: (instance: T) => T) => transformer(inst);
}

export function _makeWhen<T>(inst: T) {
    return (condition: boolean, transformer: (instance: T) => T) =>
        condition ? transformer(inst) : inst;
}
