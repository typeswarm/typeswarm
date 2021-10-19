import { immerable } from "immer";
import { propset } from "../utils";
import { DefinitionsNetwork } from "../../compose-spec";

// ---------------------------------------------------
//    ___ _   _ ___  ____ ____ _ _ _ ____ ____ _  _
//     |   \_/  |__| |___ |__  | | | |__| |__/ |\/|
//     |    |   |    |___ ___| |_|_| |  | |  \ |  |
//
// This file is generated automatically.
// Do not change it manually.
// ---------------------------------------------------

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
  protected strExternal(value: string) {
    return propset(this, "data.network.external.name", value);
  }
  protected boolExternal(value: boolean) {
    return propset(this, "data.network.external", value);
  }
  label(key: string, value: string | number | boolean | null) {
    return propset(this, "data.network.labels." + key, value);
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
