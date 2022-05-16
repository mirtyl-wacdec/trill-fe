import {BN} from "bn.js";
export type Bn = InstanceType<typeof BN>
export type PatP = string;
export type PatQ = string;
export type Rank = "galaxy" | "star" | "planet" | "moon" | "comet"
export type Iterable = any[] | Buffer | string
export type Number = number | string | Bn