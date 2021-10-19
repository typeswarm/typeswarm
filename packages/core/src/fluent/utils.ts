import produce from 'immer';
import { get, set } from 'lodash';

export function propset<I extends {}, V>(instance: I, path: string, value: V) {
    return produce(instance, (instance) => {
        set(instance, path, value);
    });
}

export function proppush<I extends {}, V>(
    instance: I,
    collectionPath: string,
    value: V
) {
    return produce(instance, (instance) => {
        const _collection = get(instance, collectionPath);
        const collection = Array.isArray(_collection) ? _collection : [];
        collection.push(value);
        set(instance, collectionPath, collection);
    });
}
