import { Mapper } from "./types";

export type MapperOneWay<TLeft, TRight> = {
  [P in keyof TRight]: (input: TLeft) => TRight[P];
};

export function mapAsymmetric<TLeft, TRight>(config: {
  map: MapperOneWay<TLeft, TRight>;
  reverse: MapperOneWay<TRight, TLeft>;
}): Mapper<TLeft, TRight> {
  const keysRight = Object.keys(config.map) as Array<keyof TRight>;
  const keysLeft = Object.keys(config.reverse) as Array<keyof TLeft>;

  const mapper: Mapper<TLeft, TRight> = {
    map: (input) => {
      const result = {} as TRight;
      for (const key of keysRight) {
        const value = config.map[key](input);
        result[key] = value;
      }
      return result;
    },
    reverse: (input) => {
      const result = {} as TLeft;
      for (const key of keysLeft) {
        const value = config.reverse[key](input);
        result[key] = value;
      }
      return result;
    },
  };
  return mapper;
}
