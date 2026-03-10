import { describe, it, expect } from "vitest";
import { PACKAGE } from "../src/index.js";

describe("@soundweave/test-kit", () => {
  it("exports package identifier", () => {
    expect(PACKAGE).toBe("@soundweave/test-kit");
  });
});
