// @soundweave/test-kit — fixtures, sample packs, contract tests
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "..", "fixtures");

export function fixturePath(name: string): string {
  return join(fixturesDir, name);
}

export function loadFixture(name: string): unknown {
  const raw = readFileSync(fixturePath(name), "utf-8");
  return JSON.parse(raw);
}

// Known fixture names
export const FIXTURES = {
  MINIMAL_PACK: "minimal-pack.json",
  STARTER_PACK: "starter-pack.json",
  INVALID_MISSING_META: "invalid-pack-missing-meta.json",
  INVALID_BAD_TRANSITION: "invalid-pack-bad-transition.json",
  INVALID_EMPTY_SCENE_LAYERS: "invalid-pack-empty-scene-layers.json",
  INVALID_BAD_ASSET_DURATION: "invalid-pack-bad-asset-duration.json",
  INTEGRITY_VALID: "integrity-valid-pack.json",
  INTEGRITY_MISSING_ASSET_REF: "integrity-missing-asset-ref.json",
  INTEGRITY_MISSING_STEM_REF: "integrity-missing-stem-ref.json",
  INTEGRITY_MISSING_SCENE_REF: "integrity-missing-scene-ref.json",
  INTEGRITY_DUPLICATE_IDS: "integrity-duplicate-ids.json",
  INTEGRITY_SELF_REFERENCE: "integrity-self-reference-pack.json",
  INTEGRITY_UNUSED_ENTITIES: "integrity-unused-entities.json",
} as const;
