import { StrictNetwork } from './models';
import { DefinitionsService } from '../compose-spec';

export function parseNetworks(
    networks: DefinitionsService['networks']
):
    | {
          [k: string]: StrictNetwork | null;
      }
    | undefined {
    if (Array.isArray(networks)) {
        return networks.reduce<{ [k: string]: null }>((dict, networkName) => {
            dict[networkName] = null;
            return dict;
        }, {});
    } else {
        return networks;
    }
}
