// ────────────────────────────────────────────
// Asset loader — fetch, decode, cache AudioBuffers
// ────────────────────────────────────────────

import type { SoundtrackPack, AudioAsset } from "@soundweave/schema";
import type { LoadState, PlaybackListener } from "./types.js";

export class AssetLoader {
  private ctx: AudioContext;
  private cache = new Map<string, AudioBuffer>();
  private inflight = new Map<string, Promise<AudioBuffer>>();
  private listener: PlaybackListener | null = null;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  setListener(listener: PlaybackListener): void {
    this.listener = listener;
  }

  /** Get a previously decoded buffer (synchronous, returns undefined if not cached) */
  getBuffer(assetId: string): AudioBuffer | undefined {
    return this.cache.get(assetId);
  }

  /** True if all given asset IDs are cached */
  allCached(assetIds: string[]): boolean {
    return assetIds.every((id) => this.cache.has(id));
  }

  /** Load all assets referenced by the given stem IDs */
  async loadForStems(
    pack: SoundtrackPack,
    stemIds: string[],
  ): Promise<{ loaded: number; errors: string[] }> {
    const stemsById = new Map(pack.stems.map((s) => [s.id, s]));
    const assetsById = new Map(pack.assets.map((a) => [a.id, a]));

    const assetsToLoad: AudioAsset[] = [];
    for (const stemId of stemIds) {
      const stem = stemsById.get(stemId);
      if (!stem) continue;
      const asset = assetsById.get(stem.assetId);
      if (!asset) continue;
      if (!this.cache.has(asset.id) && !this.inflight.has(asset.id)) {
        assetsToLoad.push(asset);
      }
    }

    if (assetsToLoad.length === 0) {
      return { loaded: 0, errors: [] };
    }

    this.emit("load-progress", { state: "loading" as LoadState, progress: 0 });

    const errors: string[] = [];
    let completed = 0;

    const promises = assetsToLoad.map(async (asset) => {
      try {
        const buffer = await this.loadAsset(asset);
        this.cache.set(asset.id, buffer);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Failed to load ${asset.id}: ${msg}`);
      } finally {
        completed++;
        this.emit("load-progress", {
          state: (errors.length > 0 ? "error" : "loading") as LoadState,
          progress: completed / assetsToLoad.length,
        });
      }
    });

    await Promise.all(promises);

    this.emit("load-progress", {
      state: errors.length > 0 ? ("error" as LoadState) : ("loaded" as LoadState),
      progress: 1,
    });

    return { loaded: completed - errors.length, errors };
  }

  /** Load a single stinger asset by asset ID */
  async loadStingerAsset(
    pack: SoundtrackPack,
    assetId: string,
  ): Promise<AudioBuffer | null> {
    if (this.cache.has(assetId)) return this.cache.get(assetId)!;

    const asset = pack.assets.find((a) => a.id === assetId);
    if (!asset) return null;

    try {
      const buffer = await this.loadAsset(asset);
      this.cache.set(asset.id, buffer);
      return buffer;
    } catch {
      return null;
    }
  }

  private async loadAsset(asset: AudioAsset): Promise<AudioBuffer> {
    // If already inflight, reuse promise
    const existing = this.inflight.get(asset.id);
    if (existing) return existing;

    const promise = (async () => {
      const response = await fetch(asset.src);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${asset.src}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return this.ctx.decodeAudioData(arrayBuffer);
    })();

    this.inflight.set(asset.id, promise);
    try {
      return await promise;
    } finally {
      this.inflight.delete(asset.id);
    }
  }

  /** Clear all cached buffers */
  clear(): void {
    this.cache.clear();
  }

  private emit(type: string, detail: unknown): void {
    this.listener?.({ type: type as import("./types.js").PlaybackEventType, detail });
  }
}
