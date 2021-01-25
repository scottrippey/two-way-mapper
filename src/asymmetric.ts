import { Mapper } from "./types";

export type OneWayMappers<TLeft, TRight> = {
  [P in keyof TRight]: (input: TLeft) => TRight[P];
};

export function asymmetric<TLeft, TRight>(
  leftMappers: OneWayMappers<TLeft, TRight>,
  rightMappers: OneWayMappers<TRight, TLeft>
): Mapper<TLeft, TRight> {
  const keysRight = Object.keys(leftMappers) as Array<keyof TRight>;
  const keysLeft = Object.keys(rightMappers) as Array<keyof TLeft>;

  const mapper: Mapper<TLeft, TRight> = {
    map: (input) => {
      const result = {} as TRight;
      for (const key of keysRight) {
        const value = leftMappers[key](input);
        result[key] = value;
      }
      return result;
    },
    reverse: (input) => {
      const result = {} as TLeft;
      for (const key of keysLeft) {
        const value = rightMappers[key](input);
        result[key] = value;
      }
      return result;
    },
  };
  return mapper;
}
