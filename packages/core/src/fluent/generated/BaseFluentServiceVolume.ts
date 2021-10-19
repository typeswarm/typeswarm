import { StrictVolume } from "../../normalize";
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

export class BaseFluentServiceVolume {
  static [immerable] = true;
  constructor(public readonly data: StrictVolume) {}
  protected sourceStr(value: string) {
    return propset(this, "data.source", value);
  }
  target(value: string) {
    return propset(this, "data.target", value);
  }
  propagation(value: string) {
    return propset(this, "data.bind.propagation", value);
  }
  consistency(value: string) {
    return propset(this, "data.bind.consistency", value);
  }
  size(value: number) {
    return propset(this, "data.tmpfs.size", value);
  }
  bind() {
    return propset(this, "data.type", "bind");
  }
  volume() {
    return propset(this, "data.type", "volume");
  }
  readOnly() {
    return propset(this, "data.read_only", true);
  }
  readWrite() {
    return propset(this, "data.read_only", false);
  }
  noCopy() {
    return propset(this, "data.volume.nocopy", true);
  }
}
