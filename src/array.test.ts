import { mapper } from "./index";
import { addressMapper, expectEqual, UserA } from "./test-utils";

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
    expectEqual(mapped, addressStrings);
  });
  it("should reverse map an array of items", () => {
    const reversed = addressArrayMapper.reverse(addressStrings);
    expectEqual(reversed, addressObjects);
  });
});
