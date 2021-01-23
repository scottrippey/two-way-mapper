import { mapMaker, Mapper } from "./mapper";

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

  address: string;
};

const commonMapper = mapMaker.object({
  id: mapMaker.copy<number>(),
});

const nameMapper = mapMaker.asymmetric<
  Pick<UserA, "fullName">,
  Pick<UserB, "firstName" | "lastName">
>({
  map: {
    fullName: (userB) => [userB.firstName, userB.lastName].join(" "),
  },
  reverse: {
    firstName: (userA) => userA.fullName.split(" ")[0],
    lastName: (userA) => userA.fullName.split(" ")[1],
  },
});

const addressMapper = mapMaker.asymmetric<
  Pick<UserA, "address">,
  Pick<UserB, "address">
>({
  map: {
    address: (userB) => {
      const [street, city, stateZip] = userB.address.split(", ");
      const [state, zip] = stateZip.split(" ");
      return { street, city, state, zip };
    },
  },
  reverse: {
    address: (userA) =>
      [
        userA.address.street,
        userA.address.city,
        userA.address.state + " " + userA.address.zip,
      ].join(", "),
  },
});

const userMapperRaw = mapMaker.combine(commonMapper, nameMapper, addressMapper);
const userMapper: Mapper<UserA, UserB> = userMapperRaw;

const mapped = userMapper.map({
  id: 5,
  fullName: "Scott Rippey",
  address: { street: "1 Main St", city: "Eagle", state: "ID", zip: "83616" },
});

const reversed = userMapper.reverse({
  id: 5,
  firstName: "Scott",
  lastName: "Rippey",
  address: "1 Main St, Eagle, ID 83616",
});
