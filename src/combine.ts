import { Mapper } from "./types";

export function combine<
  TLeft1,
  TRight1,
  TLeft1Reverse,
  TRight1Reverse,
  TLeft2,
  TRight2,
  TLeft2Reverse,
  TRight2Reverse,
  TLeft3,
  TRight3,
  TLeft3Reverse,
  TRight3Reverse,
  TLeft4,
  TRight4,
  TLeft4Reverse,
  TRight4Reverse,
  TLeft5,
  TRight5,
  TLeft5Reverse,
  TRight5Reverse
>(
  mapper1: Mapper<TLeft1, TRight1, TRight1Reverse, TLeft1Reverse>,
  mapper2: Mapper<TLeft2, TRight2, TRight2Reverse, TLeft2Reverse>,
  mapper3?: Mapper<TLeft3, TRight3, TRight3Reverse, TLeft3Reverse>,
  mapper4?: Mapper<TLeft4, TRight4, TRight4Reverse, TLeft4Reverse>,
  mapper5?: Mapper<TLeft5, TRight5, TRight5Reverse, TLeft5Reverse>
): Mapper<
  TLeft1 & TLeft2 & TLeft3 & TLeft4 & TLeft5,
  TRight1 & TRight2 & TRight3 & TRight4 & TRight5,
  TRight1Reverse &
    TRight2Reverse &
    TRight3Reverse &
    TRight4Reverse &
    TRight5Reverse,
  TLeft1Reverse & TLeft2Reverse & TLeft3Reverse & TLeft4Reverse & TLeft5Reverse
>;
export function combine(..._mappers: Array<any>) {
  const mappers = _mappers as Array<Mapper<any, any, any, any>>;
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
