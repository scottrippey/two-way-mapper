import { mapMaker, Mapper } from "./mapper";

describe("Test", () => {
  describe("mapMaker.object", () => {
    const mapper = mapMaker.object({
      id: mapMaker.copy<string>(),
      desc: mapMaker.copy<string>(),
      value: numberToString(),
    });

    it("maps one object to another", () => {
      const mapped = mapper.map({ id: "ID", desc: "DESC", value: 5 });
      expectType<{ id: string; desc: string; value: string }>(mapped);
      expect(mapped).toMatchInlineSnapshot(`
        Object {
          "desc": "DESC",
          "id": "ID",
          "value": "5",
        }
      `);
    });

    it("maps objects in reverse", () => {
      const reversed = mapper.reverse({ id: "ID", desc: "DESC", value: "5" });
      expectType<{ id: string; desc: string; value: number }>(reversed);
      expect(reversed).toMatchInlineSnapshot(`
        Object {
          "desc": "DESC",
          "id": "ID",
          "value": 5,
        }
      `);
    });

    it("missing values are not mapped", () => {
      // @ts-ignore
      const mapped = mapper.map({ id: "ID" });

      expect(mapped).toMatchInlineSnapshot(`
        Object {
          "id": "ID",
        }
      `);
    });
  });

  describe.skip("mapMaker.asymmetric", () => {
    it("", () => {
      const left = {
        name: "Scott Rippey",
      };
      const right = {
        first: "Scott",
        last: "Rippey",
      };

      const mapper = mapMaker.asymmetric<typeof left, typeof right>({
        map: {
          name: (right) => [right.first, right.last].join(" "),
        },
        reverse: {
          first: (left) => left.name.split(" ")[0],
          last: (left) => left.name.split(" ")[1],
        },
      });

      const mapped = mapper.map(left);
      expectType<{ first: string; last: string }>(mapped);

      const reversed = mapper.reverse(right);
      expectType<{ name: string }>(reversed);
    });
  });

  function numberToString(): Mapper<number, string> {
    return {
      map: (val: number) => val.toString(),
      reverse: (val) => Number(val),
    };
  }

  describe.skip("mapMaker.combine", () => {
    const map1 = mapMaker.object({
      first: mapMaker.copy<string>(),
    });
    const map2 = mapMaker.object({
      last: mapMaker.copy<string>(),
    });
    const mapper = mapMaker.combine(map1, map2);

    const first = "Scott";
    const last = "Rippey";
    expectType<{ first: string; last: string }>(mapper.map({ first, last }));
    expectType<{ first: string; last: string }>(
      mapper.reverse({ first, last })
    );
  });
});

function expectType<T>(arg: T) {}
