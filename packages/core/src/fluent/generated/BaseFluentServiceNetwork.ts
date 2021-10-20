import { immerable } from "immer";
import { propset } from "../utils";
import { proppush } from "../utils";
import { StrictNetwork } from "../../normalize";

// ---------------------------------------------------
//    ___ _   _ ___  ____ ____ _ _ _ ____ ____ _  _
//     |   \_/  |__| |___ |__  | | | |__| |__/ |\/|
//     |    |   |    |___ ___| |_|_| |  | |  \ |  |
//
// This file is generated automatically.
// Do not change it manually.
// ---------------------------------------------------

interface ServiceNetwork {
  name: string;
  network: StrictNetwork | null;
}

export class BaseFluentServiceNetwork {
  static [immerable] = true;
  constructor(public readonly data: ServiceNetwork) {}
  ipv4Address(value: string) {
    return propset(this, "data.network.ipv4_address", value);
  }
  ipv6Address(value: string) {
    return propset(this, "data.network.ipv6_address", value);
  }
  priority(value: number) {
    return propset(this, "data.network.priority", value);
  }
  alias(value: string) {
    return proppush(this, "data.network.aliases", value);
  }
  linkLocalIp(value: string) {
    return proppush(this, "data.network.link_local_ips", value);
  }
}
