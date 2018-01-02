import { AbstractControl } from "./abstract-control.model";

describe("Dummy test", () => {
  it("works if true is truthy", () => {
    expect(true).toBeTruthy();
  });

  it("DummyClass is instantiable", () => {
    expect(new AbstractControl()).toBeInstanceOf(AbstractControl);
  });
});
