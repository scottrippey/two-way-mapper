import { Mapper } from "./types";

export function properties<
  TLeft,
  TRight,
  TCommonKeys extends keyof (TLeft | TRight) = keyof (TLeft | TRight)
>(
  propertyMappers: {
    [P in TCommonKeys]: Mapper<TLeft[P], TRight[P]>;
  }
): Mapper<Pick<TLeft, TCommonKeys>, Pick<TRight, TCommonKeys>> {
  const keys = Object.keys(propertyMappers) as Array<TCommonKeys>;
  return {
    map: (input) => {
      const result = {} as TRight;
      for (const key of keys) {
        if ((key as any) in input) {
          result[key] = propertyMappers[key].map(input[key]);
        }
      }
      return result;
    },
    reverse: (input) => {
      const result = {} as TLeft;
      for (const key of keys) {
        if ((key as any) in input) {
          result[key] = propertyMappers[key].reverse(input[key]);
        }
      }
      return result;
    },
  };
}
