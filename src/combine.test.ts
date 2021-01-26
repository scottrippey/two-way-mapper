import { mapper } from "./index";
import {
  addressMapper,
  expectEqual,
  userA,
  UserA,
  userB,
  UserB,
} from "./test-utils";
import { userCommonMapper } from "./properties.test";
import { userNameMapper } from "./asymmetric.test";

export const userAddressMapper = mapper.properties<UserA, UserB, "address">({
  address: addressMapper,
});
export const userMapper = mapper.combine(
  userCommonMapper,
  userNameMapper,
  userAddressMapper
);

describe("combine", () => {
  it("should map an object", () => {
    const mapped = userMapper.map(userA);
    expectEqual(mapped, userB);
  });
  it("should reverse map an object", () => {
    const reversed = userMapper.reverse(userB);
    expectEqual(reversed, userA);
  });
});
