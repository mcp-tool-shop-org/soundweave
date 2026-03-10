import { describe, it, expect } from "vitest";
import { PACKAGE } from "../src/index.js";

describe("@soundweave/review", () => {
  it("exports package identifier", () => {
    expect(PACKAGE).toBe("@soundweave/review");
  });
});
