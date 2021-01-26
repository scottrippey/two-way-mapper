import { Mapper } from "./types";

export const copy: Mapper<any, any> = {
  map: (val) => val,
  reverse: (val) => val,
};
// These are all just strongly-typed aliases for `copy`:
export const copyString = copy as Mapper<string, string>;
export const copyNumber = copy as Mapper<number, number>;
export const copyBoolean = copy as Mapper<boolean, boolean>;
export const copyAs = <T>() => copy as Mapper<T, T>;
export const cast = <TLeft, TRight>() => copy as Mapper<TLeft, TRight>;

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
