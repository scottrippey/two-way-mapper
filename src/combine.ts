import { Mapper } from "./types";

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
