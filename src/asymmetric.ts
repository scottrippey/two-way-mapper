import { Mapper } from "./types";

export function oneWay<TLeft, TRight>(
  propertyMapper: OneWayMapper<TLeft, TRight>
): Mapper<TLeft, TRight, {}, {}> {
  return {
    map: createOneWayMapper<TLeft, TRight>(propertyMapper),
    reverse: () => ({}),
  };
}

export function oneWayReverse<TLeft, TRight>(
  propertyMapper: OneWayMapper<TRight, TLeft>
): Mapper<{}, {}, TRight, TLeft> {
  return {
    map: () => ({}),
    reverse: createOneWayMapper<TRight, TLeft>(propertyMapper),
  };
}

export function twoWay<TLeft, TRight>(
  propertyMapper: OneWayMapper<TLeft, TRight>,
  propertyMapperReverse: OneWayMapper<TRight, TLeft>
): Mapper<TLeft, TRight> {
  return {
    map: createOneWayMapper<TLeft, TRight>(propertyMapper),
    reverse: createOneWayMapper<TRight, TLeft>(propertyMapperReverse),
  };
}

type OneWayMapper<TLeft, TRight> = {
  [P in keyof TRight]: (input: TLeft) => TRight[P];
};

function createOneWayMapper<TLeft, TRight>(
  propertyMapper: OneWayMapper<TLeft, TRight>
) {
  const keysRight = Object.keys(propertyMapper) as Array<keyof TRight>;

  return (input: TLeft) => {
    const result = {} as TRight;
    for (const key of keysRight) {
      const value = propertyMapper[key](input);
      result[key] = value;
    }
    return result;
  };
}
