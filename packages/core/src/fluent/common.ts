import { ok } from 'assert';
import produce, { Draft } from 'immer';
import { set } from 'lodash';

export function _makeWith<T>(inst: T) {
    return (transformer: (instance: T) => T) => transformer(inst);
}

type Truthy<T> = T extends null | undefined | false | '' ? never : T;

export function _makeWhen<T>(inst: T) {
    return <C extends any>(
        condition: C,
        transformer: (instance: T, condition: Truthy<C>) => T
    ) => {
        if (condition) {
            return transformer(inst, condition as Truthy<C>);
        }
        return inst;
    };
}

export interface ISetPlugin<I> {
    (keyValueMap: Record<string, any>): (i: I) => I;
    (key: string | string[], value: any): (i: I) => I;
}
export interface IProducePlugin<
    Instance extends { data: Data },
    Data extends object
> {
    (producer: (d: Draft<Data>) => void): (i: Instance) => Instance;
}

export function _makeSet<
    Instance extends { data: Data },
    Data extends object
>(constr: { new (data: Data): Instance }): ISetPlugin<Instance> {
    const self = createConstructFn<Instance, Data>(constr);
    return (keyPath, value?: any) => (instance: Instance) => {
        return self(
            produce(instance.data, data => {
                if (typeof keyPath === 'string' || Array.isArray(keyPath)) {
                    set(data, keyPath, value);
                    return;
                }
                for (const [k, v] of Object.entries(keyPath)) {
                    set(data, k, v);
                }
            })
        );
    };
}

export function _makeProduce<
    Instance extends { data: Data },
    Data extends object
>(constr: { new (data: Data): Instance }): IProducePlugin<Instance, Data> {
    const self = createConstructFn<Instance, Data>(constr);
    return prd => (instance: Instance) => {
        return self(produce(instance.data, prd));
    };
}

function createConstructFn<Instance, Data>(constructor: {
    new (data: Data): Instance;
}): (data: Data) => Instance {
    return (data: Data) => new constructor(data);
}
