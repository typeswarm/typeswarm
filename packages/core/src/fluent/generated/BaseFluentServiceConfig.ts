import { StrictConfig } from "../../normalize";
import { immerable } from "immer";
import { propset } from "../utils";

// ---------------------------------------------------
//    ___ _   _ ___  ____ ____ _ _ _ ____ ____ _  _
//     |   \_/  |__| |___ |__  | | | |__| |__/ |\/|
//     |    |   |    |___ ___| |_|_| |  | |  \ |  |
//
// This file is generated automatically.
// Do not change it manually.
// ---------------------------------------------------

export class BaseFluentServiceConfig {
  static [immerable] = true;
  constructor(public readonly data: StrictConfig) {}
  target(value: string) {
    return propset(this, "data.target", value);
  }
  uid(value: string) {
    return propset(this, "data.uid", value);
  }
  gid(value: string) {
    return propset(this, "data.gid", value);
  }
  mode(value: number) {
    return propset(this, "data.mode", value);
  }
}
