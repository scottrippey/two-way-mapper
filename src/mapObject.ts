import { Mapper } from "./types";

/**
 * Creates a two-way Mapper for objects that share property names.
 * Property values can be the same or completely different types.
 *
 * @example
 * const mapper = mapObject({
 *   id: utils.copy<string>(),
 *   address: addressMapper,
 * });
 *
 * @param propertyMappers
 */
export function mapObject<
  TPropertyMappers extends { [P in string]: Mapper<any, any> }
>(propertyMappers: TPropertyMappers) {
  type TLeft = {
    [P in keyof TPropertyMappers]: ReturnType<TPropertyMappers[P]["reverse"]>;
  };
  type TRight = {
    [P in keyof TPropertyMappers]: ReturnType<TPropertyMappers[P]["map"]>;
  };

  const keys = Object.keys(propertyMappers) as Array<keyof TPropertyMappers>;
  const mapper: Mapper<TLeft, TRight> = {
    map: (input) => {
      const result = {} as TRight;
      for (const key of keys) {
        if (key in input) {
          result[key] = propertyMappers[key].map(input[key]);
        }
      }
      return result;
    },
    reverse: (input) => {
      const result = {} as TLeft;
      for (const key of keys) {
        if (key in input) {
          result[key] = propertyMappers[key].reverse(input[key]);
        }
      }
      return result;
    },
  };
  return mapper;
}
