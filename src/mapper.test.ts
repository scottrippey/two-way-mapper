import { mapAsymmetric, mapCombine, mapObject, utils } from "./mapper";

describe("mapMaker", () => {
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

  const commonMapper = mapObject({
    id: utils.convert<string, number>(Number, String),
    nickName: utils.copy<string>(),
  });

  describe("mapMaker.object", () => {
    it("maps one object to another", () => {
      const mapped = commonMapper.map({ id: "5", nickName: "Nick" });
      expectType<{ id: number; nickName: string }>(mapped);
      expect(mapped).toEqual({ id: 5, nickName: "Nick" });
    });

    it("maps objects in reverse", () => {
      const reversed = commonMapper.reverse({ id: 5, nickName: "Nick" });
      expectType<{ id: string; nickName: string }>(reversed);
      expect(reversed).toEqual({ id: "5", nickName: "Nick" });
    });

    it("missing or extra values are not mapped", () => {
      // @ts-ignore
      const mapped = commonMapper.map({ id: "5", foo: "FOO" });
      expect(mapped).toEqual({ id: 5 });
    });
  });

  const nameMapper = mapAsymmetric<
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

  const addressMapper = mapAsymmetric<
    Pick<UserA, "address">,
    Pick<UserB, "address">
  >({
    map: {
      address: (userA) =>
        [
          userA.address.street,
          userA.address.city,
          userA.address.state + " " + userA.address.zip,
        ].join(", "),
    },
    reverse: {
      address: (userB) => {
        const [street, city, stateZip] = userB.address.split(", ");
        const [state, zip] = stateZip.split(" ");
        return { street, city, state, zip };
      },
    },
  });

  describe("mapMaker.asymmetric", () => {
    const userA = {
      fullName: "Scott Rippey",
    };
    const right = {
      firstName: "Scott",
      lastName: "Rippey",
    };

    it("should map an object", () => {
      const mapped = nameMapper.map(userA);
      expectType<{ firstName: string; lastName: string }>(mapped);
      expect(mapped).toEqual(right);
    });
    it("should reverse map an object", () => {
      const reversed = nameMapper.reverse(right);
      expectType<{ fullName: string }>(reversed);
      expect(reversed).toEqual(userA);
    });
  });

  const userMapper = mapCombine(commonMapper, nameMapper, addressMapper);

  describe("mapMaker.combine", () => {
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
});

function expectType<T>(arg: T) {}
