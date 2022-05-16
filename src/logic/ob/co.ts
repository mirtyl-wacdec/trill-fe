// ++  co
//
// See arvo/sys/hoon.hoon.
import { BN } from "bn.js";
import { chunk, isEqual } from "lodash";
import { ob } from "./ob";
import type {Bn, PatP, PatQ, Rank, Iterable, Number} from "./types";

const zero = new BN(0);
const one = new BN(1);
const two = new BN(2);
const three = new BN(3);
const four = new BN(4);
const five = new BN(5);

const pre = `
dozmarbinwansamlitsighidfidlissogdirwacsabwissib\
rigsoldopmodfoglidhopdardorlorhodfolrintogsilmir\
holpaslacrovlivdalsatlibtabhanticpidtorbolfosdot\
losdilforpilramtirwintadbicdifrocwidbisdasmidlop\
rilnardapmolsanlocnovsitnidtipsicropwitnatpanmin\
ritpodmottamtolsavposnapnopsomfinfonbanmorworsip\
ronnorbotwicsocwatdolmagpicdavbidbaltimtasmallig\
sivtagpadsaldivdactansidfabtarmonranniswolmispal\
lasdismaprabtobrollatlonnodnavfignomnibpagsopral\
bilhaddocridmocpacravripfaltodtiltinhapmicfanpat\
taclabmogsimsonpinlomrictapfirhasbosbatpochactid\
havsaplindibhosdabbitbarracparloddosbortochilmac\
tomdigfilfasmithobharmighinradmashalraglagfadtop\
mophabnilnosmilfopfamdatnoldinhatnacrisfotribhoc\
nimlarfitwalrapsarnalmoslandondanladdovrivbacpol\
laptalpitnambonrostonfodponsovnocsorlavmatmipfip\
`;

const suf = `
zodnecbudwessevpersutletfulpensytdurwepserwylsun\
rypsyxdyrnuphebpeglupdepdysputlughecryttyvsydnex\
lunmeplutseppesdelsulpedtemledtulmetwenbynhexfeb\
pyldulhetmevruttylwydtepbesdexsefwycburderneppur\
rysrebdennutsubpetrulsynregtydsupsemwynrecmegnet\
secmulnymtevwebsummutnyxrextebfushepbenmuswyxsym\
selrucdecwexsyrwetdylmynmesdetbetbeltuxtugmyrpel\
syptermebsetdutdegtexsurfeltudnuxruxrenwytnubmed\
lytdusnebrumtynseglyxpunresredfunrevrefmectedrus\
bexlebduxrynnumpyxrygryxfeptyrtustyclegnemfermer\
tenlusnussyltecmexpubrymtucfyllepdebbermughuttun\
bylsudpemdevlurdefbusbeprunmelpexdytbyttyplevmyl\
wedducfurfexnulluclennerlexrupnedlecrydlydfenwel\
nydhusrelrudneshesfetdesretdunlernyrsebhulryllud\
remlysfynwerrycsugnysnyllyndyndemluxfedsedbecmun\
lyrtesmudnytbyrsenwegfyrmurtelreptegpecnelnevfes\
`;

const patp2syls = (name: string) =>
  name.replace(/[\^~-]/g, "").match(/.{1,3}/g) || [];

const splitAt = (index: number, str: string) => [
  str.slice(0, index),
  str.slice(index),
];

const prefixes = pre.match(/.{1,3}/g) as RegExpMatchArray;

const suffixes = suf.match(/.{1,3}/g) as RegExpMatchArray;

const bex = (n: Bn): Bn => two.pow(n);

const rsh = (a: Bn, b: Bn, c: Bn): Bn => c.div(bex(bex(a).mul(b)));

const met = (a: Bn, b: Bn, c: Bn = zero): Bn =>
  b.eq(zero) ? c : met(a, rsh(a, one, b), c.add(one));

const end = (a: Bn, b: Bn, c: Bn) => c.mod(bex(bex(a).mul(b)));

/**
 * Convert a hex-encoded string to a @p-encoded string.
 *
 */
const hex2patp = (hex: string) : string=> {
  if (hex === null) {
    throw new Error("hex2patp: null input");
  }
  return patp(new BN(hex, "hex"));
};

/**
 * Convert a @p-encoded string to a hex-encoded string.
 *
 * @param  {String}  name @p
 * @return  {String}
 */
const patp2hex = (name: PatP): string => {
  if (isValidPat(name) === false) {
    throw new Error("patp2hex: not a valid @p");
  }
  const syls = patp2syls(name);

  const syl2bin = (idx: number) => idx.toString(2).padStart(8, "0");

  const addr = syls.reduce(
    (acc, syl, idx) =>
      idx % 2 !== 0 || syls.length === 1
        ? acc + syl2bin(suffixes.indexOf(syl))
        : acc + syl2bin(prefixes.indexOf(syl)),
    ""
  );

  const bn = new BN(addr, 2);
  const hex = ob.fynd(bn).toString("hex");
  return hex.length % 2 !== 0 ? hex.padStart(hex.length + 1, "0") : hex;
};

/**
 * Convert a @p-encoded string to a bignum.
 *
 */
const patp2bn = (name: PatP): Bn => new BN(patp2hex(name), "hex");

/**
 * Convert a @p-encoded string to a decimal-encoded string.
 *
 */
export const patp2dec = (name: PatP): string => {
  let bn;
  try {
    bn = patp2bn(name);
  } catch (_) {
    throw new Error("patp2dec: not a valid @p");
  }
  return bn.toString();
};

/**
 * Convert a number to a @q-encoded string.
 *
 */
const patq = (arg: number | Bn | string): string => {
  const bn = new BN(arg);
  const buf = bn.toArrayLike(Buffer);
  return buf2patq(buf);
};

/**
 * Convert a Buffer into a @q-encoded string.
 *
 */
const buf2patq = (buf: Buffer): string => {
  const chunked =
    buf.length % 2 !== 0 && buf.length > 1
      ? [[buf[0]]].concat(chunk(buf.slice(1), 2))
      : chunk(buf, 2);

  const prefixName = (byts: number[]) =>
    byts[1] === undefined
      ? prefixes[0] + suffixes[byts[0]]
      : prefixes[byts[0]] + suffixes[byts[1]];

  const name = (byts: number[]) =>
    byts[1] === undefined
      ? suffixes[byts[0]]
      : prefixes[byts[0]] + suffixes[byts[1]];

  const alg = (pair: number[]) =>
    pair.length % 2 !== 0 && chunked.length > 1 ? prefixName(pair) : name(pair);

  return chunked.reduce(
    (acc, elem) => acc + (acc === "~" ? "" : "-") + alg(elem),
    "~"
  );
};

/**
 * Convert a hex-encoded string to a @q-encoded string.
 *
 * Note that this preserves leading zero bytes.
 *
 */
const hex2patq = (arg: string): string => {
  const hex = arg.length % 2 !== 0 ? arg.padStart(arg.length + 1, "0") : arg;

  const buf = Buffer.from(hex, "hex");
  return buf2patq(buf);
};

/**
 * Convert a @q-encoded string to a hex-encoded string.
 *
 * Note that this preserves leading zero bytes.
 *
 */
const patq2hex = (name: PatQ): string => {
  if (isValidPat(name) === false) {
    throw new Error("patq2hex: not a valid @q");
  }
  const chunks = name.slice(1).split("-");
  const dec2hex = (dec: number) => dec.toString(16).padStart(2, "0");

  const splat = chunks.map((chunk) => {
    let syls = splitAt(3, chunk);
    return syls[1] === ""
      ? dec2hex(suffixes.indexOf(syls[0]))
      : dec2hex(prefixes.indexOf(syls[0])) + dec2hex(suffixes.indexOf(syls[1]));
  });

  return name.length === 0 ? "00" : splat.join("");
};

/**
 * Convert a @q-encoded string to a bignum.
 *
 */
const patq2bn = (name: PatQ): Bn => new BN(patq2hex(name), "hex");

/**
 * Convert a @q-encoded string to a decimal-encoded string.
 *
 */
const patq2dec = (name: PatQ): string => {
  let bn;
  try {
    bn = patq2bn(name);
  } catch (_) {
    throw new Error("patq2dec: not a valid @q");
  }
  return bn.toString();
};

/**
 * Determine the ship class of a @p value.
 *
 */
const clan = (who: PatP): Rank => {
  let name;
  try {
    name = patp2bn(who);
  } catch (_) {
    throw new Error("clan: not a valid @p");
  }

  const wid = met(three, name);
  return wid.lte(one)
    ? "galaxy"
    : wid.eq(two)
    ? "star"
    : wid.lte(four)
    ? "planet"
    : wid.lte(new BN(8))
    ? "moon"
    : "comet";
};

/**
 * Determine the parent of a @p value.
 *
 */
const sein = (name: PatP): PatP => {
  let who;
  try {
    who = patp2bn(name);
  } catch (_) {
    throw new Error("sein: not a valid @p");
  }

  let mir;
  try {
    mir = clan(name);
  } catch (_) {
    throw new Error("sein: not a valid @p");
  }

  const res =
    mir === "galaxy"
      ? who
      : mir === "star"
      ? end(three, one, who)
      : mir === "planet"
      ? end(four, one, who)
      : mir === "moon"
      ? end(five, one, who)
      : zero;
  return patp(res);
};

/**
 * Weakly check if a string is a valid @p or @q value.
 *
 * This is, at present, a pretty weak sanity check.  It doesn't confirm the
 * structure precisely (e.g. dashes), and for @q, it's required that q values
 * of (greater than one) odd bytelength have been zero-padded.  So, for
 * example, '~doznec-binwod' will be considered a valid @q, but '~nec-binwod'
 * will not.
 *

 */
const isValidPat = (name: PatQ | PatP): boolean => {
  if (typeof name !== "string") {
    throw new Error("isValidPat: non-string input");
  }

  const leadingTilde = name.slice(0, 1) === "~";

  if (leadingTilde === false || name.length < 4) {
    return false;
  } else {
    const syls = patp2syls(name);
    const wrongLength = syls.length % 2 !== 0 && syls.length !== 1;
    const sylsExist = syls.reduce(
      (acc, syl, index) =>
        acc &&
        (index % 2 !== 0 || syls.length === 1
          ? suffixes.includes(syl)
          : prefixes.includes(syl)),
      true
    );

    return !wrongLength && sylsExist;
  }
};

/**
 * Validate a @p string.
 *
 */
export const isValidPatp = (str: PatP): boolean =>
  isValidPat(str) && str === patp(patp2dec(str));

/**
 * Validate a @q string.
 *
 */
const isValidPatq = (str: PatQ): boolean =>
  isValidPat(str) && eqPatq(str, patq(patq2dec(str)));

/**
 * Remove all leading zero bytes from a sliceable value.
 */
const removeLeadingZeroBytes = (str: Iterable): Iterable  =>
  str.slice(0, 2) === "00" ? removeLeadingZeroBytes(str.slice(2)) : str;

/**
 * Equality comparison, modulo leading zero bytes.
 */
const eqModLeadingZeroBytes = (s: Iterable, t: Iterable): boolean =>
  isEqual(removeLeadingZeroBytes(s), removeLeadingZeroBytes(t));

/**
 * Equality comparison on @q values.
 */
const eqPatq = (p: PatQ, q: PatQ): boolean => {
  let phex;
  try {
    phex = patq2hex(p);
  } catch (_) {
    throw new Error("eqPatq: not a valid @q");
  }

  let qhex;
  try {
    qhex = patq2hex(q);
  } catch (_) {
    throw new Error("eqPatq: not a valid @q");
  }

  return eqModLeadingZeroBytes(phex, qhex);
};

/**
 * Convert a number to a @p-encoded string.
 *
 * @param  {String, Number, BN}  arg
 * @return  {String}
 */
const patp = (arg: number | string | Bn): PatP => {
  if (arg === null) {
    throw new Error("patp: null input");
  }
  const n = new BN(arg);

  const sxz = ob.fein(n);
  const dyy = met(four, sxz);

  const loop = (tsxz: Bn, timp: Bn, trep: string): string => {
    const log = end(four, one, tsxz);
    const pre = prefixes[rsh(three, one, log).toNumber()];
    const suf = suffixes[end(three, one, log).toNumber()];
    const etc = timp.mod(four).eq(zero) ? (timp.eq(zero) ? "" : "--") : "-";

    const res = pre + suf + etc + trep;

    return timp.eq(dyy) ? trep : loop(rsh(four, one, tsxz), timp.add(one), res);
  };

  const dyx = met(three, sxz);

  return "~" + (dyx.lte(one) ? suffixes[sxz.toNumber()] : loop(sxz, zero, ""));
};

export const co = {
  patp,
};
