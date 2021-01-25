# two-way-mapper

Converts JavaScript objects from one format to another.

Strong TypeScript support.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# Overview

- [Quick Start](#quick-start)
- [Primary Methods](#primary-methods)
  - [`map.object(propertyMappers)` - Maps between objects with similar properties](#mapobjectpropertymappers---maps-between-objects-with-similar-properties)
  - [`map.asymmetric(leftMappers, rightMappers)` - Maps objects with different properties](#mapasymmetricleftmappers-rightmappers---maps-objects-with-different-properties)
  - [`map.combine(...mappers)` - Combines multiple mappers into a single mapper](#mapcombinemappers---combines-multiple-mappers-into-a-single-mapper)
- [Utilities](#utilities)
  - [`map.array(itemMapper)` - maps all values in an array](#maparrayitemmapper---maps-all-values-in-an-array)
  - [`map.copy` - copies a value as-is](#mapcopy---copies-a-value-as-is)
  - [`map.convert(left, right)`](#mapconvertleft-right)
  - [`map.constant(leftValue, rightValue)`](#mapconstantleftvalue-rightvalue)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Quick Start

Install via `npm install two-way-mapper`  

Import via `import { map } from 'two-way-mapper'`

All methods on the `map` namespace return a `Mapper`, which is an interface as follows:
```ts
interface Mapper<TLeft, TRight> { 
    map(input: TLeft): TRight;
    reverse(input: TRight): TLeft;
}
```
As you can see, the `map` method converts from `TLeft` to `TRight`.  The `reverse` method converts from `TRight` to `TLeft`.


# Primary Methods

## `map.object(propertyMappers)` - Maps between objects with similar properties
Say we have 2 similar, yet different, `User` types:
```ts
const userA: UserA = { id: 5, active: 'yes' };
const userB: UserB = { id: 5, active: true };
```

We use `map.object` to determine how each property is mapped:

```ts
import { map } from 'two-way-mapper';

const userMapper = map.object<UserA, UserB>({
  // Properties with the same name & type can simply be copied:
  id: map.copy,
  
  // Properties with different types can be mapped:
  active: map.convert(
    (active) => active === "yes",
    (active) => (active ? "yes" : "no")
  )
});
```

And now `userMapper` converts between `userA` and `userB`:
```ts
// The `map` function takes UserA and returns UserB:
userB = userMapper.map(userA);
// Likewise, the `reverse` function takes UserB and returns UserA:
userA = userMapper.reverse(userB);
```

## `map.asymmetric(leftMappers, rightMappers)` - Maps objects with different properties
Docs incoming...

## `map.combine(...mappers)` - Combines multiple mappers into a single mapper
Docs incoming...

# Utilities

## `map.array(itemMapper)` - maps all values in an array

## `map.copy` - copies a value as-is
Strongly-typed variants:
- `map.copyString`
- `map.copyNumber`
- `map.copyAs<T>()`
- `map.cast<TLeft, TRight>()`

## `map.convert(left, right)`

## `map.constant(leftValue, rightValue)`

