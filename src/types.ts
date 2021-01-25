export type Mapper<TLeft, TRight> = {
  map: (input: TLeft) => TRight;
  reverse: (input: TRight) => TLeft;
};
