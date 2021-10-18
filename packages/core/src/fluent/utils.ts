import produce from 'immer';
import { set } from 'lodash';

export function propset<I extends {}, V>(instance: I, path: string, value: V) {
    return produce(instance, instance => {
        set(instance, path, value);
    });
}
