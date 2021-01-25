export type Mapper<TLeft, TRight> = {
  map: (input: TLeft) => TRight;
  reverse: (input: TRight) => TLeft;
};

// properties
export namespace mapper {
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
}

// asymmetric
export namespace mapper {
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
}

// combine
export namespace mapper {
  export function combine<TLeft1, TRight1, TLeft2, TRight2>(
    mapper1: Mapper<TLeft1, TRight1>,
    mapper2: Mapper<TLeft2, TRight2>
  ): Mapper<TLeft1 & TLeft2, TRight1 & TRight2>;
  export function combine<TLeft1, TRight1, TLeft2, TRight2, TLeft3, TRight3>(
    mapper1: Mapper<TLeft1, TRight1>,
    mapper2: Mapper<TLeft2, TRight2>,
    mapper3: Mapper<TLeft3, TRight3>
  ): Mapper<TLeft1 & TLeft2 & TLeft3, TRight1 & TRight2 & TRight3>;
  export function combine<
    TLeft1,
    TRight1,
    TLeft2,
    TRight2,
    TLeft3,
    TRight3,
    TLeft4,
    TRight4
  >(
    mapper1: Mapper<TLeft1, TRight1>,
    mapper2: Mapper<TLeft2, TRight2>,
    mapper3: Mapper<TLeft3, TRight3>,
    mapper4: Mapper<TLeft4, TRight4>
  ): Mapper<
    TLeft1 & TLeft2 & TLeft3 & TLeft4,
    TRight1 & TRight2 & TRight3 & TRight4
  >;
  export function combine<
    TLeft1,
    TRight1,
    TLeft2,
    TRight2,
    TLeft3,
    TRight3,
    TLeft4,
    TRight4,
    TLeft5,
    TRight5
  >(
    mapper1: Mapper<TLeft1, TRight1>,
    mapper2: Mapper<TLeft2, TRight2>,
    mapper3: Mapper<TLeft3, TRight3>,
    mapper4: Mapper<TLeft4, TRight4>,
    mapper5: Mapper<TLeft5, TRight5>
  ): Mapper<
    TLeft1 & TLeft2 & TLeft3 & TLeft4 & TLeft5,
    TRight1 & TRight2 & TRight3 & TRight4 & TRight5
  >;
  export function combine(...mappers: Array<Mapper<unknown, unknown>>) {
    const mapper: Mapper<unknown, unknown> = {
      map: (input) => {
        const result = {};
        for (const m of mappers) {
          const mappedValue = m.map(input);
          Object.assign(result, mappedValue);
        }
        return result;
      },
      reverse: (input) => {
        const result = {};
        for (const m of mappers) {
          const mappedValue = m.reverse(input);
          Object.assign(result, mappedValue);
        }
        return result;
      },
    };
    return mapper;
  }
}

// array
export namespace mapper {
  export function array<TLeft, TRight>(
    itemMapper: Mapper<TLeft, TRight>
  ): Mapper<TLeft[], TRight[]> {
    return {
      map: (input) => input.map((item) => itemMapper.map(item)),
      reverse: (input) => input.map((item) => itemMapper.reverse(item)),
    };
  }
}

// utils
export namespace mapper {
  export const copy: Mapper<any, any> = {
    map: (val) => val,
    reverse: (val) => val,
  };
  // These are just strongly-typed aliases for `copy`:
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
}
