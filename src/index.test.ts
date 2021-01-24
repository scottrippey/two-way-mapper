import { map } from "./index";

function expectType<T>(arg: T) {}

type UserA = {
  id: string;
  nickName: string;

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
  nickName: string;

  firstName: string;
  lastName: string;

  address: string;
};

const addressMapper = map.convert<UserA["address"], UserB["address"]>(
  (addr) => `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`,
  (addr) => {
    const [street, city, stateZip] = addr.split(", ");
    const [state, zip] = stateZip.split(" ");
    return { street, city, state, zip };
  }
);

const userCommonMapper = map.object({
  id: map.convert(Number, String),
  nickName: map.copyString,
});
describe("object", () => {
  it("maps one object to another", () => {
    const mapped = userCommonMapper.map({ id: "5", nickName: "Nick" });
    expectType<{ id: number; nickName: string }>(mapped);
    expect(mapped).toEqual({ id: 5, nickName: "Nick" });
  });

  it("maps objects in reverse", () => {
    const reversed = userCommonMapper.reverse({ id: 5, nickName: "Nick" });
    expectType<{ id: string; nickName: string }>(reversed);
    expect(reversed).toEqual({ id: "5", nickName: "Nick" });
  });

  it("missing or extra values are not mapped", () => {
    // @ts-ignore
    const mapped = userCommonMapper.map({ id: "5", foo: "FOO" });
    expect(mapped).toEqual({ id: 5 });
  });
});

const userNameMapper = map.asymmetric<
  Pick<UserA, "fullName">,
  Pick<UserB, "firstName" | "lastName">
>({
  map: {
    firstName: (userA) => userA.fullName.split(" ")[0],
    lastName: (userA) => userA.fullName.split(" ")[1],
  },
  reverse: {
    fullName: (userB) => [userB.firstName, userB.lastName].join(" "),
  },
});
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

const userAddressMapper = map.object({
  address: addressMapper,
});

const userMapper = map.combine(
  userCommonMapper,
  userNameMapper,
  userAddressMapper
);
describe("mapCombine", () => {
  const userA: UserA = {
    id: "5",
    nickName: "Scooter",
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
    nickName: "Scooter",
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
