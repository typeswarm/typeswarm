import { StrictPortMapping } from "../../normalize";
import { immerable } from "immer";
import { propset } from "../utils";

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
