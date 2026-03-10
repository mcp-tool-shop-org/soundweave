import { describe, it, expect } from "vitest";
import { PACKAGE } from "../src/index.js";

describe("@soundweave/runtime-pack", () => {
  it("exports package identifier", () => {
    expect(PACKAGE).toBe("@soundweave/runtime-pack");
  });
});
