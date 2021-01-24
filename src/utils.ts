import { Mapper } from "./types";

export const copyAny: Mapper<any, any> = {
  map: (val) => val,
  reverse: (val) => val,
};
// These are all just strongly-typed aliases for `copyAny`:
export const copyString = copyAny as Mapper<string, string>;
export const copyNumber = copyAny as Mapper<number, number>;
export const copyBoolean = copyAny as Mapper<boolean, boolean>;
export const copyAs = <T>() => copyAny as Mapper<T, T>;
export const cast = <TLeft, TRight>() => copyAny as Mapper<TLeft, TRight>;

export function convert<TLeft, TRight>(
  map: (value: TLeft) => TRight,
  reverse: (value: TRight) => TLeft
): Mapper<TLeft, TRight> {
  return { map, reverse };
}

export function constant<TLeft, TRight>(
  mapValue: TRight,
  reverseValue: TLeft
): Mapper<TLeft, TRight> {
  return { map: () => mapValue, reverse: () => reverseValue };
}
