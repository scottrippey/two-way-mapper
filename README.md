# two-way-mapper

Converts JavaScript objects from one format to another.

Supports asymmetric mapping.

Simple, powerful, composable, strongly-typed.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# Overview

- [Quick Start](#quick-start)
- [Primary Methods](#primary-methods)
  - [`mapper.properties(propertyMappers)` - maps objects with similar properties](#mapperpropertiespropertymappers---maps-objects-with-similar-properties)
  - [`mapper.twoWay(leftMapper, rightMapper)` - maps objects with different properties](#mappertwowayleftmapper-rightmapper---maps-objects-with-different-properties)
  - [`mapper.oneWay(leftMapper)` - maps objects in one direction only](#mapperonewayleftmapper---maps-objects-in-one-direction-only)
  - [`mapper.combine(...mappers)` - combines multiple mappers into a single mapper](#mappercombinemappers---combines-multiple-mappers-into-a-single-mapper)
- [Utilities](#utilities)
  - [`mapper.array(itemMapper)` - maps all values in an array](#mapperarrayitemmapper---maps-all-values-in-an-array)
  - [`mapper.copy` - copies a value as-is](#mappercopy---copies-a-value-as-is)
  - [`mapper.convert(left, right)` - manually specify how to convert a value](#mapperconvertleft-right---manually-specify-how-to-convert-a-value)
  - [`mapper.constant(rightValue, leftValue)` - use constant values when mapping](#mapperconstantrightvalue-leftvalue---use-constant-values-when-mapping)
  - [Utilities Example](#utilities-example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Quick Start

Install via `npm install two-way-mapper`  

Import via `import { mapper } from 'two-way-mapper'`

All methods on the `mapper` namespace return a `Mapper`, which is an interface as follows:
```ts
interface Mapper<TLeft, TRight> { 
    map(input: TLeft): TRight;
    reverse(input: TRight): TLeft;
}
```
As you can see, the `map` method converts from `TLeft` to `TRight`.  The `reverse` method converts from `TRight` to `TLeft`.


# Primary Methods

## `mapper.properties(propertyMappers)` - maps objects with similar properties
Let's convert between two **similar** `User` types:
```ts
const userA: UserA = { name: "Scott", active: "yes" };
const userB: UserB = { name: "Scott", active: true };
```

With `mapper.properties`, we supply a `Mapper` for each property:

```ts
import { mapper } from "two-way-mapper";

const userMapper = mapper.properties<UserA, UserB>({
  // Properties with the same name & type can simply be copied:
  name: mapper.copy,
  
  // Properties with different types can be mapped:
  active: mapper.convert(
    (active) => active === "yes",
    (active) => (active ? "yes" : "no")
  )
});
```
And now `userMapper` converts data from `UserA` to `UserB`:
```ts
// The `map` function takes UserA and returns UserB:
const userB = userMapper.map(userA);
// Likewise, the `reverse` function takes UserB and returns UserA:
const userA = userMapper.reverse(userB);
```


## `mapper.twoWay(leftMapper, rightMapper)` - maps objects with different properties
Let's convert between two **different** `User` types:
```ts
const userA: UserA = { fullName: "Scott Rippey", status: 'active' };
const userB: UserB = { name: "Scott Rippey", active: boolean };
```

With `mapper.twoWay`, we use two mapping objects, for mapping properties in both directions:
```ts
const userMapper =  mapper.twoWay<UserA, UserB>(
  { 
    name: (input) => input.fullName, 
    active: (input) => input.status === 'active',
  }, 
  {
    fullName: (input) => input.name,
    status: (input) => input.active ? 'active' : 'inactive',
  }
)
```
And now, use `userMapper.map` and `.reverse` to map between `UserA` to `UserB`. 

## `mapper.oneWay(leftMapper)` - maps objects in one direction only
Sometimes, we only want to convert data in one direction.  
A **one-way mapper** only converts from A to B, but not from B to A.
```ts
const userA: UserA = { friends: [ { ... }, { ... }, { ... } ] };
const userB: UserB = { friendsCount: 3 };

const userMapper = mapper.oneWay<UserA, UserB>({
  friendsCount: (input) => input.friends.length
});
```
The mapper still implements the two-way `Mapper` interface, but the `reverse` method does nothing.

`oneWayReverse<A, B>()` works the same as `oneWay`, but it only implements the `reverse` method that converts from `B` to `A` (and the `map` method does nothing).

## `mapper.combine(...mappers)` - combines multiple mappers into a single mapper
Now, let's convert between two `User` types that have a mix of **similar** and **different** properties.
```ts
const userA: UserA = { id: 5, name: "Scott", status: "active" };
const userB: UserB = { id: 5, name: "Scott", active: true };
```
We can use `mapper.combine` to use both `mapper.properties` and `mapper.twoWay` in the same mapper:
```ts
const userMapper = mapper.combine(
  mapper.properties<UserA, UserB>({
    id: mapper.copy,
    name: mapper.copy,
  }),
  mapper.twoWay<UserA, UserB>({
    active: (input) => input.status === "active",
  }, {
    status: (input) => input.active ? "active" : "inactive",
  })
);
```

# Utilities
The `mapper` namespace also contains several utilities to make type-safe mapping easier.

## `mapper.array(itemMapper)` - maps all values in an array

## `mapper.copy` - copies a value as-is
You can also use these strongly-typed variants:
- `mapper.copyAs<T>()`
- `mapper.cast<TLeft, TRight>()`

## `mapper.convert(left, right)` - manually specify how to convert a value

## `mapper.constant(rightValue, leftValue)` - use constant values when mapping

## Utilities Example

```ts
const userMapper = mapper.properties<UserA, UserB>({
  // Converts all items in the array using itemMapper:
  items: mapper.array(itemMapper),
  
  // Copy the value as-is:
  id: mapper.copy,
  // Same as copy, but ensures both types are strings:
  name: mapper.copyAs<string>(),
  // Cast between two types (value is still copied as-is):
  status: mapper.cast<StatusEnumA, StatusEnumB>(),
  
  // Convert types manually:
  active: mapper.convert(
    input => input.active ? 'yes' : 'no',
    input => input.active === 'yes'      
  ),
  
  // Use a constant value when mapping:
  typename: mapper.constant('UserA', 'UserB'),
});
```
