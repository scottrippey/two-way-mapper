# two-way-mapper

Converts JavaScript objects from one format to another.

Strong TypeScript support.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# Overview

- [Quick Start](#quick-start)
- [Primary Methods](#primary-methods)
  - [`mapper.object(propertyMappers)` - Maps between objects with similar properties](#mapperobjectpropertymappers---maps-between-objects-with-similar-properties)
  - [`mapper.asymmetric(leftMappers, rightMappers)` - Maps objects with different properties](#mapperasymmetricleftmappers-rightmappers---maps-objects-with-different-properties)
  - [`mapper.combine(...mappers)` - Combines multiple mappers into a single mapper](#mappercombinemappers---combines-multiple-mappers-into-a-single-mapper)
- [Utilities](#utilities)
  - [`mapper.array(itemMapper)` - maps all values in an array](#mapperarrayitemmapper---maps-all-values-in-an-array)
  - [`mapper.copy` - copies a value as-is](#mappercopy---copies-a-value-as-is)
  - [`mapper.convert(left, right)` - manually specify how to convert a value](#mapperconvertleft-right---manually-specify-how-to-convert-a-value)
  - [`mapper.constant(rightValue, leftValue)` -](#mapperconstantrightvalue-leftvalue--)
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

## `mapper.object(propertyMappers)` - Maps between objects with similar properties
Let's convert between two **similar** `User` types:
```ts
const userA: UserA = { name: "Scott", active: "yes" };
const userB: UserB = { name: "Scott", active: true };
```

With `mapper.object`, we supply a `Mapper` for each property:

```ts
import { mapper } from "two-way-mapper";

const userMapper = mapper.object<UserA, UserB>({
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


## `mapper.asymmetric(leftMappers, rightMappers)` - Maps objects with different properties
Let's convert between two **different** `User` types:
```ts
const userA: UserA = { fullName: "Scott Rippey", status: 'active' };
const userB: UserB = { name: "Scott Rippey", active: boolean };
```

With `mapper.asymmetric`, we supply two objects, for mapping properties in each direction:
```ts
const userMapper =  mapper.asymmetric<UserA, UserB>(
  { 
    name: (input) => input.fullName, 
    active: (input) => input.status === 'active',
  }, {
    fullName: (input) => input.name,
    status: (input) => input.active ? 'active' : 'inactive',
  }
)
```
And now, use `userMapper.map` and `.reverse` to map between `UserA` to `UserB`. 

## `mapper.combine(...mappers)` - Combines multiple mappers into a single mapper
Now, let's convert between two `User` types that have a mix of **similar** and **different** properties.
```ts
const userA: UserA = { id: 5, name: "Scott", status: "active" };
const userB: UserB = { id: 5, name: "Scott", active: true };
```
We can use `mapper.combine` to use both `mapper.object` and `mapper.asymmetric` in the same mapper:
```ts
const userMapper = mapper.combine(
  mapper.object<UserA, UserB>({
    id: mapper.copy,
    name: mapper.copy,
  }),
  mapper.asymmetric<UserA, UserB>({
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

## `mapper.constant(rightValue, leftValue)` - 

## Utilities Example

```ts
const userMapper = mapper.object<UserA, UserB>({
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
