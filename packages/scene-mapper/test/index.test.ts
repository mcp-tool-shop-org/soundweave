import { describe, it, expect } from "vitest";
import { PACKAGE } from "../src/index.js";

describe("@soundweave/scene-mapper", () => {
  it("exports package identifier", () => {
    expect(PACKAGE).toBe("@soundweave/scene-mapper");
  });
});
