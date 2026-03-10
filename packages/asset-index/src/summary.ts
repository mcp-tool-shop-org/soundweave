import type { SoundtrackPack } from "@soundweave/schema";
import type { IntegritySummary } from "./types.js";
import { auditPackIntegrity } from "./audit.js";
import { findUnusedAssets, findUnusedStems, findUnreferencedScenes } from "./unused.js";

/**
 * Produce a summary of pack composition and integrity.
 */
export function summarizePackIntegrity(pack: SoundtrackPack): IntegritySummary {
  const audit = auditPackIntegrity(pack);

  return {
    assetCount: pack.assets.length,
    stemCount: pack.stems.length,
    sceneCount: pack.scenes.length,
    bindingCount: pack.bindings.length,
    transitionCount: pack.transitions.length,

    unusedAssetCount: findUnusedAssets(pack).length,
    unusedStemCount: findUnusedStems(pack).length,
    unreferencedSceneCount: findUnreferencedScenes(pack).length,

    errorCount: audit.errors.length,
    warningCount: audit.warnings.length,
    noteCount: audit.notes.length,
  };
}
