import { describe, it, expect } from "vitest";
import { PACKAGE } from "../src/index.js";

describe("@soundweave/asset-index", () => {
  it("exports package identifier", () => {
    expect(PACKAGE).toBe("@soundweave/asset-index");
  });
});
