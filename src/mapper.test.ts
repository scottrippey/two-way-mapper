import { mapMaker, Mapper } from "./mapper";

describe("Test", () => {
  describe("mapper.object", () => {
    it("", () => {
      const mapper = mapMaker.object({
        id: mapMaker.copy<string>(),
        desc: mapMaker.copy<string>(),
        value: numberToString(),
      });

      const mapped = mapper.map({ id: "", desc: "", value: 5 });
      expectType<string>(mapped.value);

      const reverse = mapper.reverse({ id: "", desc: "", value: "5" });
      expectType<number>(reverse.value);
    });
    it("", () => {
      const mapper: Mapper<{ first: string; last: string }, string> = {
        map: (input) => [input.first, input.last].join(" "),
        reverse: (input) => {
          const [first, last] = input.split(" ");
          return { first, last };
        },
      };

      const mapped = mapper.map({ first: "Scott", last: "Rippey" });
      expectType<string>(mapped);

      const reverse = mapper.reverse("Scott Rippey");
      expectType<{ first: string; last: string }>(reverse);
    });
  });
  describe("mapper.asymmetric", () => {
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

  describe("mapper.combine", () => {
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
