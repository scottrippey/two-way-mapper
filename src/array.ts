import { Mapper } from "./types";

export function array<TLeft, TRight>(
  itemMapper: Mapper<TLeft, TRight>
): Mapper<TLeft[], TRight[]> {
  return {
    map: (input) => input.map((item) => itemMapper.map(item)),
    reverse: (input) => input.map((item) => itemMapper.reverse(item)),
  };
}
