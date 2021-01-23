export type Mapper<TLeft, TRight> = {
  map: (input: TLeft) => TRight;
  reverse: (input: TRight) => TLeft;
};

export namespace mapMaker {
  export function object<TMappings extends { [P in string]: Mapper<any, any> }>(
    mappings: TMappings
  ): Mapper<
    { [P in keyof TMappings]: ReturnType<TMappings[P]["reverse"]> },
    { [P in keyof TMappings]: ReturnType<TMappings[P]["map"]> }
  > {
    return null as any;
  }
}

export namespace mapMaker {
  export type MapperConfig<TLeft, TRight> = {
    [P in keyof TLeft]: (input: TRight) => TLeft[P];
  };
  export function asymmetric<TLeft, TRight>(config: {
    map: MapperConfig<TLeft, TRight>;
    reverse: MapperConfig<TRight, TLeft>;
  }): Mapper<TLeft, TRight> {
    return null as any;
  }
}

export namespace mapMaker {
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
  export function combine(
    mapper1: Mapper<unknown, unknown>,
    mapper2: Mapper<unknown, unknown>,
    mapper3?: Mapper<unknown, unknown>,
    mapper4?: Mapper<unknown, unknown>,
    mapper5?: Mapper<unknown, unknown>
  ) {
    return null as any;
  }

  export function copy<T>(): Mapper<T, T> {
    return { map: (val) => val, reverse: (val) => val };
  }
}
