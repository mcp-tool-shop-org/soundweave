import { describe, it, expect } from "vitest";
import { PACKAGE } from "../src/index.js";

describe("@soundweave/schema", () => {
  it("exports package identifier", () => {
    expect(PACKAGE).toBe("@soundweave/schema");
  });
});
