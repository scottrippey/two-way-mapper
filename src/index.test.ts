import { mapper } from "./index";

function expectType<T>(arg: T) {}

type UserA = {
  id: number;
  active: "yes" | "no";

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
  active: boolean;

  firstName: string;
  lastName: string;

  address: string;
};

const userCommonMapper = mapper.properties<UserA, UserB, "id" | "active">({
  id: mapper.copy,
  active: mapper.convert(
    (active) => active === "yes",
    (active) => (active ? "yes" : "no")
  ),
});
describe("properties", () => {
  it("maps one object to another", () => {
    const mapped = userCommonMapper.map({ id: 5, active: "yes" });
    expectType<{ id: number; active: boolean }>(mapped);
    expect(mapped).toEqual({ id: 5, active: true });
  });

  it("maps objects in reverse", () => {
    const reversed = userCommonMapper.reverse({ id: 5, active: true });
    expectType<{ id: number; active: "yes" | "no" }>(reversed);
    expect(reversed).toEqual({ id: 5, active: "yes" });
  });

  it("missing or extra values are not mapped", () => {
    // @ts-ignore
    const mapped = userCommonMapper.map({ id: 5, foo: "FOO" });
    expect(mapped).toEqual({ id: 5 });
  });
});

const userNameMapper = mapper.twoWay<
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
describe("asymmetric", () => {
  const userA = {
    fullName: "Scott Rippey",
  };
  const right = {
    firstName: "Scott",
    lastName: "Rippey",
  };

  it("should map an object", () => {
    const mapped = userNameMapper.map(userA);
    expectType<{ firstName: string; lastName: string }>(mapped);
    expect(mapped).toEqual(right);
  });
  it("should reverse map an object", () => {
    const reversed = userNameMapper.reverse(right);
    expectType<{ fullName: string }>(reversed);
    expect(reversed).toEqual(userA);
  });
});

const addressMapper = mapper.convert<UserA["address"], UserB["address"]>(
  (addr) => `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`,
  (addr) => {
    const [street, city, stateZip] = addr.split(", ");
    const [state, zip] = stateZip.split(" ");
    return { street, city, state, zip };
  }
);
const userAddressMapper = mapper.properties<UserA, UserB, "address">({
  address: addressMapper,
});

const userMapper = mapper.combine(
  userCommonMapper,
  userNameMapper,
  userAddressMapper
);
describe("combine", () => {
  const userA: UserA = {
    id: 5,
    active: "yes",
    fullName: "Scott Rippey",
    address: {
      street: "1 Main St",
      city: "Eagle",
      state: "ID",
      zip: "83616",
    },
  };
  const userB: UserB = {
    id: 5,
    active: true,
    firstName: "Scott",
    lastName: "Rippey",
    address: "1 Main St, Eagle, ID 83616",
  };
  it("should map an object", () => {
    const mapped = userMapper.map(userA);
    expectType<UserB>(mapped);
    expect(mapped).toEqual(userB);
  });
  it("should reverse map an object", () => {
    const reversed = userMapper.reverse(userB);
    expectType<UserA>(reversed);
    expect(reversed).toEqual(userA);
  });
});

const addressArrayMapper = mapper.array(addressMapper);
describe("array", () => {
  const addressObjects: Array<UserA["address"]> = [
    { street: "1 Main Street", city: "Eagle", state: "ID", zip: "83616" },
    { street: "2 Second Street", city: "New York", state: "NY", zip: "10001" },
  ];
  const addressStrings = [
    "1 Main Street, Eagle, ID 83616",
    "2 Second Street, New York, NY 10001",
  ];
  it("should map an array of items", () => {
    const mapped = addressArrayMapper.map(addressObjects);
    expectType<string[]>(mapped);
    expect(mapped).toEqual(addressStrings);
  });
  it("should reverse map an array of items", () => {
    const reversed = addressArrayMapper.reverse(addressStrings);
    expectType<UserA["address"][]>(reversed);
    expect(reversed).toEqual(addressObjects);
  });
});
