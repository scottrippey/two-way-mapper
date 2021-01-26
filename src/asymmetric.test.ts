import { mapper } from "./index";

type UserA = {
  id: number;

  fullName: string;

  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
};
type UserB = {
  id: number;

  firstName: string;
  lastName: string;

  fullAddress: string;
};

const addressMapper = mapper.oneWay<
  Pick<UserA, "address">,
  Pick<UserB, "fullAddress">
>({
  fullAddress: ({ address: { street, city, state, zip } }) =>
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
      fullAddress: "1 Main Street, Eagle, ID 83616",
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
  mapper.properties<UserA, UserB>({
    id: mapper.copy,
  }),
  addressMapper,
  nameMapper
);

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
      fullAddress: "1 Main Street, Eagle, ID 83616",
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

function expectEqual<T>(actual: T, expected: T) {
  expect(actual).toEqual(expected);
}
