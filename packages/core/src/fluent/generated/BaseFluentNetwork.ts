import { immerable } from "immer";
import { propset } from "../utils";
import { DefinitionsNetwork } from "../../compose-spec";
interface NetworkRegistration {
  name?: string;
  network: DefinitionsNetwork;
}

export class BaseFluentNetwork {
  static [immerable] = true;
  constructor(public readonly data: NetworkRegistration) {}
  driver(value: string) {
    return propset(this, "data.network.driver", value);
  }
  driverOpts(value: Record<string, string | number>) {
    return propset(this, "data.network.driver_opts", value);
  }
  externalName(value: string) {
    return propset(this, "data.network.external.name", value);
  }
  label(key: string, value: string) {
    return propset(this, "data.network.labels" + "." + key, value);
  }
  isExternal() {
    return propset(this, "data.network.external", true);
  }
  internal() {
    return propset(this, "data.network.internal", true);
  }
  enableIPv6() {
    return propset(this, "data.network.enable_ipv6", true);
  }
  attachable() {
    return propset(this, "data.network.attachable", true);
  }
}
