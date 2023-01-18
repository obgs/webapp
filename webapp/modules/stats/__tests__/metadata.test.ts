import { parseEnumMetadata } from "../metadata";

describe("parseEnumMetadata", () => {
  it("should return correct possible values", () => {
    expect(
      parseEnumMetadata('{"possibleValues":["a","b","c"]}').possibleValues
    ).toEqual(["a", "b", "c"]);
    expect(parseEnumMetadata('{"possibleValues": []}').possibleValues).toEqual(
      []
    );
  });

  it("should throw an error if possible values are not defined", () => {
    expect(() => parseEnumMetadata("{}")).toThrowError();
    expect(() => parseEnumMetadata('{"possibleValues": null}')).toThrowError();
  });

  it("should throw an error if metadata is not valid JSON", () => {
    expect(() => parseEnumMetadata("")).toThrowError();
    expect(() => parseEnumMetadata("invalid")).toThrowError();
  });
});
