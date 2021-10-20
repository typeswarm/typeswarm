import { StrictPortMapping } from "../../normalize";
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

export class BaseFluentPort {
  static [immerable] = true;
  constructor(public readonly data: StrictPortMapping) {}
  target(value: number) {
    return propset(this, "data.target", value);
  }
  as(value: number) {
    return propset(this, "data.published", value);
  }
  udp() {
    return propset(this, "data.protocol", "udp");
  }
  tcp() {
    return propset(this, "data.protocol", "tcp");
  }
  host() {
    return propset(this, "data.mode", "host");
  }
  ingress() {
    return propset(this, "data.mode", "ingress");
  }
}
