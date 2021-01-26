export type Mapper<
  TLeft,
  TRight,
  TReverseRight = TRight,
  TReverseLeft = TLeft
> = {
  map: (input: TLeft) => TRight;
  reverse: (input: TReverseRight) => TReverseLeft;
};
