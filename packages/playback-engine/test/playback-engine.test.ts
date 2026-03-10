import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SoundtrackPack } from "@soundweave/schema";
import { loadFixture, FIXTURES } from "@soundweave/test-kit";
import { dbToGain } from "../src/scene-player.js";

// ── Minimal mock for Web Audio API ──

function createMockAudioBuffer(): AudioBuffer {
  return {
    duration: 2,
    length: 44100 * 2,
    numberOfChannels: 2,
    sampleRate: 44100,
    getChannelData: vi.fn(() => new Float32Array(44100 * 2)),
    copyFromChannel: vi.fn(),
    copyToChannel: vi.fn(),
  } as unknown as AudioBuffer;
}

function createMockGainNode(): GainNode {
  const gain = {
    value: 1,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
    setTargetAtTime: vi.fn(),
    cancelScheduledValues: vi.fn(),
    defaultValue: 1,
    minValue: -3.4028235e38,
    maxValue: 3.4028235e38,
    automationRate: "a-rate" as AudioParam["automationRate"],
  };
  return {
    gain,
    connect: vi.fn(),
    disconnect: vi.fn(),
    context: null,
    channelCount: 2,
    channelCountMode: "max",
    channelInterpretation: "speakers",
    numberOfInputs: 1,
    numberOfOutputs: 1,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as GainNode;
}

function createMockBufferSource(): AudioBufferSourceNode {
  return {
    buffer: null,
    loop: false,
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: null,
    playbackRate: { value: 1 },
    detune: { value: 0 },
    loopStart: 0,
    loopEnd: 0,
    context: null,
    channelCount: 2,
    channelCountMode: "max",
    channelInterpretation: "speakers",
    numberOfInputs: 0,
    numberOfOutputs: 1,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as AudioBufferSourceNode;
}

function createMockAudioContext(): AudioContext {
  return {
    currentTime: 0,
    state: "running",
    destination: {} as AudioDestinationNode,
    resume: vi.fn(() => Promise.resolve()),
    close: vi.fn(() => Promise.resolve()),
    createGain: vi.fn(() => createMockGainNode()),
    createBufferSource: vi.fn(() => createMockBufferSource()),
    decodeAudioData: vi.fn(() => Promise.resolve(createMockAudioBuffer())),
  } as unknown as AudioContext;
}

// ── Tests ──

describe("dbToGain", () => {
  it("converts 0 dB to gain 1", () => {
    expect(dbToGain(0)).toBeCloseTo(1);
  });

  it("converts -6 dB to approximately 0.5", () => {
    expect(dbToGain(-6)).toBeCloseTo(0.5012, 3);
  });

  it("converts -20 dB to 0.1", () => {
    expect(dbToGain(-20)).toBeCloseTo(0.1, 4);
  });

  it("converts +6 dB to approximately 2", () => {
    expect(dbToGain(6)).toBeCloseTo(1.9953, 3);
  });
});

describe("AssetLoader", () => {
  let ctx: AudioContext;
  let pack: SoundtrackPack;

  beforeEach(() => {
    ctx = createMockAudioContext();
    pack = loadFixture(FIXTURES.STARTER_PACK) as SoundtrackPack;
  });

  it("can be constructed", async () => {
    const { AssetLoader } = await import("../src/loader.js");
    const loader = new AssetLoader(ctx);
    expect(loader).toBeDefined();
  });

  it("reports all cached for empty stem list", async () => {
    const { AssetLoader } = await import("../src/loader.js");
    const loader = new AssetLoader(ctx);
    expect(loader.allCached([])).toBe(true);
  });

  it("reports not cached for unloaded assets", async () => {
    const { AssetLoader } = await import("../src/loader.js");
    const loader = new AssetLoader(ctx);
    expect(loader.allCached(["asset-explore-base"])).toBe(false);
  });

  it("loads assets for stems using fetch + decodeAudioData", async () => {
    const { AssetLoader } = await import("../src/loader.js");
    const loader = new AssetLoader(ctx);

    // Mock fetch
    const mockArrayBuffer = new ArrayBuffer(100);
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(mockArrayBuffer),
      } as Response),
    );

    const result = await loader.loadForStems(pack, ["stem-explore-base"]);
    expect(result.loaded).toBe(1);
    expect(result.errors).toHaveLength(0);
    expect(loader.getBuffer("asset-explore-base")).toBeDefined();
  });

  it("handles fetch errors gracefully", async () => {
    const { AssetLoader } = await import("../src/loader.js");
    const loader = new AssetLoader(ctx);

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      } as Response),
    );

    const result = await loader.loadForStems(pack, ["stem-explore-base"]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain("404");
  });

  it("clears cache", async () => {
    const { AssetLoader } = await import("../src/loader.js");
    const loader = new AssetLoader(ctx);

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
      } as Response),
    );

    await loader.loadForStems(pack, ["stem-explore-base"]);
    expect(loader.getBuffer("asset-explore-base")).toBeDefined();

    loader.clear();
    expect(loader.getBuffer("asset-explore-base")).toBeUndefined();
  });
});

describe("ScenePlayer", () => {
  let ctx: AudioContext;
  let pack: SoundtrackPack;

  beforeEach(() => {
    ctx = createMockAudioContext();
    pack = loadFixture(FIXTURES.STARTER_PACK) as SoundtrackPack;

    // Mock fetch for loading
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
      } as Response),
    );
  });

  it("plays a scene and returns stem IDs", async () => {
    const { AssetLoader } = await import("../src/loader.js");
    const { ScenePlayer } = await import("../src/scene-player.js");
    const loader = new AssetLoader(ctx);
    const player = new ScenePlayer(ctx, loader);

    const stemIds = await player.playScene(pack, "scene-exploration");
    expect(stemIds).toContain("stem-explore-base");
    expect(stemIds).toContain("stem-explore-accent");
    expect(player.sceneId).toBe("scene-exploration");
  });

  it("tracks stem handles after playing", async () => {
    const { AssetLoader } = await import("../src/loader.js");
    const { ScenePlayer } = await import("../src/scene-player.js");
    const loader = new AssetLoader(ctx);
    const player = new ScenePlayer(ctx, loader);

    await player.playScene(pack, "scene-combat");
    expect(player.stemHandles.size).toBe(2); // combat-base + combat-danger
  });

  it("stopAll clears handles and scene", async () => {
    const { AssetLoader } = await import("../src/loader.js");
    const { ScenePlayer } = await import("../src/scene-player.js");
    const loader = new AssetLoader(ctx);
    const player = new ScenePlayer(ctx, loader);

    await player.playScene(pack, "scene-exploration");
    expect(player.sceneId).toBe("scene-exploration");

    player.stopAll();
    expect(player.sceneId).toBeNull();
    expect(player.stemHandles.size).toBe(0);
  });

  it("setMuted toggles stem mute state", async () => {
    const { AssetLoader } = await import("../src/loader.js");
    const { ScenePlayer } = await import("../src/scene-player.js");
    const loader = new AssetLoader(ctx);
    const player = new ScenePlayer(ctx, loader);

    await player.playScene(pack, "scene-exploration");
    player.setMuted("stem-explore-base", true);
    expect(player.stemHandles.get("stem-explore-base")?.muted).toBe(true);
  });

  it("setSolo toggles stem solo state", async () => {
    const { AssetLoader } = await import("../src/loader.js");
    const { ScenePlayer } = await import("../src/scene-player.js");
    const loader = new AssetLoader(ctx);
    const player = new ScenePlayer(ctx, loader);

    await player.playScene(pack, "scene-exploration");
    player.setSolo("stem-explore-base", true);
    expect(player.stemHandles.get("stem-explore-base")?.solo).toBe(true);
  });

  it("setGain updates stem gain", async () => {
    const { AssetLoader } = await import("../src/loader.js");
    const { ScenePlayer } = await import("../src/scene-player.js");
    const loader = new AssetLoader(ctx);
    const player = new ScenePlayer(ctx, loader);

    await player.playScene(pack, "scene-exploration");
    player.setGain("stem-explore-base", -6);
    expect(player.stemHandles.get("stem-explore-base")?.userGainDb).toBe(-6);
  });
});

describe("Transport", () => {
  beforeEach(() => {
    // Mock AudioContext constructor
    vi.stubGlobal(
      "AudioContext",
      vi.fn(() => createMockAudioContext()),
    );

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
      } as Response),
    );
  });

  it("creates and returns snapshot in stopped state", async () => {
    const { Transport } = await import("../src/transport.js");
    const t = new Transport();
    const snap = t.getSnapshot();
    expect(snap.transport).toBe("stopped");
    expect(snap.currentSceneId).toBeNull();
  });

  it("ensureContext creates AudioContext", async () => {
    const { Transport } = await import("../src/transport.js");
    const t = new Transport();
    const ctx = t.ensureContext();
    expect(ctx).toBeDefined();
  });

  it("playScene transitions to playing state", async () => {
    const { Transport } = await import("../src/transport.js");
    const t = new Transport();
    const pack = loadFixture(FIXTURES.STARTER_PACK) as SoundtrackPack;

    await t.playScene(pack, "scene-exploration");
    const snap = t.getSnapshot();
    expect(snap.transport).toBe("playing");
    expect(snap.currentSceneId).toBe("scene-exploration");
  });

  it("stop transitions back to stopped", async () => {
    const { Transport } = await import("../src/transport.js");
    const t = new Transport();
    const pack = loadFixture(FIXTURES.STARTER_PACK) as SoundtrackPack;

    await t.playScene(pack, "scene-exploration");
    t.stop();
    const snap = t.getSnapshot();
    expect(snap.transport).toBe("stopped");
  });

  it("on/off subscribes and unsubscribes", async () => {
    const { Transport } = await import("../src/transport.js");
    const t = new Transport();
    const events: string[] = [];
    const unsub = t.on((evt) => events.push(evt.type));
    const pack = loadFixture(FIXTURES.STARTER_PACK) as SoundtrackPack;

    await t.playScene(pack, "scene-exploration");
    expect(events.length).toBeGreaterThan(0);

    unsub();
  });

  it("dispose cleans up", async () => {
    const { Transport } = await import("../src/transport.js");
    const t = new Transport();
    t.ensureContext();
    t.dispose();
    const snap = t.getSnapshot();
    expect(snap.transport).toBe("stopped");
  });

  it("mute/solo/gain delegate to scene player", async () => {
    const { Transport } = await import("../src/transport.js");
    const t = new Transport();
    const pack = loadFixture(FIXTURES.STARTER_PACK) as SoundtrackPack;

    await t.playScene(pack, "scene-exploration");
    // These should not throw
    t.setMuted("stem-explore-base", true);
    t.setSolo("stem-explore-base", true);
    t.setGain("stem-explore-base", -3);
  });
});
