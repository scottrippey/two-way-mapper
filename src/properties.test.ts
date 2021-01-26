import { mapper } from "./index";
import { expectEqual, UserA, UserB } from "./test-utils";

export const userCommonMapper = mapper.properties<
  UserA,
  UserB,
  "id" | "active"
>({
  id: mapper.copy,
  active: mapper.convert(
    (active) => active === "yes",
    (active) => (active ? "yes" : "no")
  ),
});
describe("properties", () => {
  it("maps one object to another", () => {
    const mapped = userCommonMapper.map({ id: 5, active: "yes" });
    expectEqual(mapped, { id: 5, active: true });
  });

  it("maps objects in reverse", () => {
    const reversed = userCommonMapper.reverse({ id: 5, active: true });
    expectEqual(reversed, { id: 5, active: "yes" });
  });

  it("missing or extra values are not mapped", () => {
    // @ts-ignore
    const mapped = userCommonMapper.map({ id: 5, foo: "FOO" });
    expect(mapped).toEqual({ id: 5 });
  });
});
