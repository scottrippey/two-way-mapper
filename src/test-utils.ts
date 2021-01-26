import { mapper } from "./index";

export function expectEqual<T>(actual: T, expected: T) {
  try {
    expect(actual).toEqual(expected);
  } catch (e) {
    Error.captureStackTrace(e, expectEqual);
    throw e;
  }
}

export interface UserA {
  id: number;

  fullName: string;

  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  active: "yes" | "no";
}

export interface UserB {
  id: number;

  firstName: string;
  lastName: string;

  address: string;

  active: boolean;
}

export const userA: UserA = {
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

export const userB: UserB = {
  id: 5,
  active: true,
  firstName: "Scott",
  lastName: "Rippey",
  address: "1 Main St, Eagle, ID 83616",
};

export const addressMapper = mapper.convert<UserA["address"], UserB["address"]>(
  (addr) => `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`,
  (addr) => {
    const [street, city, stateZip] = addr.split(", ");
    const [state, zip] = stateZip.split(" ");
    return { street, city, state, zip };
  }
);
