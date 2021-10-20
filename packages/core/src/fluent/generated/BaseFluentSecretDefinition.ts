import { immerable } from "immer";
import { propset } from "../utils";
import { DefinitionsSecret } from "../../compose-spec";

// ---------------------------------------------------
//    ___ _   _ ___  ____ ____ _ _ _ ____ ____ _  _
//     |   \_/  |__| |___ |__  | | | |__| |__/ |\/|
//     |    |   |    |___ ___| |_|_| |  | |  \ |  |
//
// This file is generated automatically.
// Do not change it manually.
// ---------------------------------------------------

interface SecretRegistration {
  name?: string;
  secret: DefinitionsSecret;
}

export class BaseFluentSecretDefinition {
  static [immerable] = true;
  constructor(public readonly data: SecretRegistration) {}
  name(value: string) {
    return propset(this, "data.secret.name", value);
  }
  file(value: string) {
    return propset(this, "data.secret.file", value);
  }
  text(value: string) {
    return propset(this, "data.secret.data", value);
  }
  protected strExternal(value: string) {
    return propset(this, "data.secret.external.name", value);
  }
  protected boolExternal(value: boolean) {
    return propset(this, "data.secret.external", value);
  }
  driver(value: string) {
    return propset(this, "data.secret.driver", value);
  }
  template_driver(value: string) {
    return propset(this, "data.secret.template_driver", value);
  }
  driverOpts(value: Record<string, string | number>) {
    return propset(this, "data.secret.driver_opts", value);
  }
  label(key: string, value: string | number | boolean | null) {
    return propset(this, "data.secret.labels." + key, value);
  }
}
