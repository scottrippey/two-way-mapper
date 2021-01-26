import { mapper } from "./index";
import { expectEqual, userA, UserA, userB, UserB } from "./test-utils";

const addressMapper = mapper.oneWay<
  Pick<UserA, "address">,
  Pick<UserB, "address">
>({
  address: ({ address: { street, city, state, zip } }) =>
    `${street}, ${city}, ${state} ${zip}`,
});

describe("oneWay", () => {
  it("should only map objects", () => {
    const mapped = addressMapper.map({
      address: {
        street: "1 Main Street",
        city: "Eagle",
        state: "ID",
        zip: "83616",
      },
    });
    expectEqual(mapped, {
      address: "1 Main Street, Eagle, ID 83616",
    });
  });
  it("should NOT reverse map", () => {
    expectEqual(addressMapper.reverse({}), {});
  });
});

const nameMapper = mapper.oneWayReverse<
  Pick<UserA, "fullName">,
  Pick<UserB, "firstName" | "lastName">
>({
  fullName: (input) => `${input.firstName} ${input.lastName}`,
});

describe("oneWayReverse", () => {
  it("should NOT map objects", () => {
    expectEqual(nameMapper.map({}), {});
  });
  it("should only reverse map", () => {
    let reversed = nameMapper.reverse({
      firstName: "Scott",
      lastName: "Rippey",
    });
    expectEqual(reversed, {
      fullName: "Scott Rippey",
    });
  });
});

const userMapper = mapper.combine(
  mapper.properties<UserA, UserB, "id">({
    id: mapper.copy,
  }),
  addressMapper,
  nameMapper
);

export const userNameMapper = mapper.twoWay<
  Pick<UserA, "fullName">,
  Pick<UserB, "firstName" | "lastName">
>(
  {
    firstName: (userA) => userA.fullName.split(" ")[0],
    lastName: (userA) => userA.fullName.split(" ")[1],
  },
  {
    fullName: (userB) => [userB.firstName, userB.lastName].join(" "),
  }
);

describe("twoWay", () => {
  it("should map an object", () => {
    const mapped = userNameMapper.map(userA);
    expectEqual(mapped, { firstName: "Scott", lastName: "Rippey" });
  });
  it("should reverse map an object", () => {
    const reversed = userNameMapper.reverse(userB);
    expectEqual(reversed, { fullName: "Scott Rippey" });
  });
});

describe("combine", () => {
  it("should map asymmetric objects", () => {
    const mapped = userMapper.map({
      id: 5,
      address: {
        street: "1 Main Street",
        city: "Eagle",
        state: "ID",
        zip: "83616",
      },
    });
    expectEqual(mapped, {
      id: 5,
      address: "1 Main Street, Eagle, ID 83616",
    });
  });
  it("should reverse map asymmetric objects", () => {
    const reversed = userMapper.reverse({
      id: 5,
      firstName: "Scott",
      lastName: "Rippey",
    });
    expectEqual(reversed, {
      id: 5,
      fullName: "Scott Rippey",
    });
  });
});
