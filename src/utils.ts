import { Mapper } from "./types";

export const copy: Mapper<any, any> = {
  map: (val) => val,
  reverse: (val) => val,
};
export function copyAs<T>(): Mapper<T, T> {
  return copy as Mapper<T, T>;
}

export function convert<TLeft, TRight>(
  map: (value: TLeft) => TRight,
  reverse: (value: TRight) => TLeft
): Mapper<TLeft, TRight> {
  return { map, reverse };
}
