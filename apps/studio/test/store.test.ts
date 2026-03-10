import { describe, it, expect, beforeEach } from "vitest";
import { useStudioStore } from "../src/app/store";
import { starterPack } from "../src/app/seed-data";
import type { SoundtrackPack } from "@soundweave/schema";

// Reset store before each test
beforeEach(() => {
  useStudioStore.setState({
    pack: JSON.parse(JSON.stringify(starterPack)) as SoundtrackPack,
    section: "project",
    selectedId: null,
  });
});

describe("store — navigation", () => {
  it("switches section and clears selection", () => {
    const store = useStudioStore.getState();
    store.setSelectedId("asset-explore-base");
    store.setSection("stems");
    const state = useStudioStore.getState();
    expect(state.section).toBe("stems");
    expect(state.selectedId).toBeNull();
  });
});

describe("store — meta editing", () => {
  it("updates pack name", () => {
    useStudioStore.getState().updateMeta({ name: "My Custom Pack" });
    expect(useStudioStore.getState().pack.meta.name).toBe("My Custom Pack");
  });

  it("updates multiple meta fields", () => {
    useStudioStore.getState().updateMeta({
      version: "2.0.0",
      author: "tester",
    });
    const meta = useStudioStore.getState().pack.meta;
    expect(meta.version).toBe("2.0.0");
    expect(meta.author).toBe("tester");
  });
});

describe("store — asset CRUD", () => {
  it("adds an asset and selects it", () => {
    const newAsset = {
      id: "test-asset",
      name: "Test",
      src: "audio/test.ogg",
      kind: "loop" as const,
      durationMs: 1000,
    };
    useStudioStore.getState().addAsset(newAsset);
    const state = useStudioStore.getState();
    expect(state.pack.assets).toHaveLength(9);
    expect(state.selectedId).toBe("test-asset");
  });

  it("updates an asset field", () => {
    useStudioStore
      .getState()
      .updateAsset("asset-explore-base", { name: "Renamed" });
    const asset = useStudioStore
      .getState()
      .pack.assets.find((a) => a.id === "asset-explore-base");
    expect(asset?.name).toBe("Renamed");
  });

  it("deletes an asset and fixes selection", () => {
    useStudioStore.getState().setSelectedId("asset-explore-base");
    useStudioStore.getState().deleteAsset("asset-explore-base");
    const state = useStudioStore.getState();
    expect(state.pack.assets).toHaveLength(7);
    expect(state.pack.assets.find((a) => a.id === "asset-explore-base")).toBeUndefined();
    // selection should move to first surviving asset
    expect(state.selectedId).toBe("asset-explore-accent");
  });

  it("deleting non-selected asset does not change selection", () => {
    useStudioStore.getState().setSelectedId("asset-explore-base");
    useStudioStore.getState().deleteAsset("asset-combat-base");
    expect(useStudioStore.getState().selectedId).toBe("asset-explore-base");
  });
});

describe("store — stem CRUD", () => {
  it("adds a stem", () => {
    const newStem = {
      id: "test-stem",
      name: "Test Stem",
      assetId: "asset-explore-base",
      role: "base" as const,
      loop: true,
    };
    useStudioStore.getState().addStem(newStem);
    expect(useStudioStore.getState().pack.stems).toHaveLength(8);
  });

  it("updates a stem", () => {
    useStudioStore
      .getState()
      .updateStem("stem-explore-base", { role: "danger" });
    const stem = useStudioStore
      .getState()
      .pack.stems.find((s) => s.id === "stem-explore-base");
    expect(stem?.role).toBe("danger");
  });

  it("deletes a stem", () => {
    useStudioStore.getState().deleteStem("stem-explore-base");
    expect(useStudioStore.getState().pack.stems).toHaveLength(6);
  });
});

describe("store — scene CRUD", () => {
  it("adds a scene", () => {
    const newScene = {
      id: "test-scene",
      name: "Test Scene",
      category: "exploration" as const,
      layers: [{ stemId: "stem-explore-base" }],
    };
    useStudioStore.getState().addScene(newScene);
    expect(useStudioStore.getState().pack.scenes).toHaveLength(6);
  });

  it("updates a scene", () => {
    useStudioStore
      .getState()
      .updateScene("scene-exploration", { name: "Big Forest" });
    const scene = useStudioStore
      .getState()
      .pack.scenes.find((s) => s.id === "scene-exploration");
    expect(scene?.name).toBe("Big Forest");
  });

  it("deletes a scene", () => {
    useStudioStore.getState().deleteScene("scene-safe-zone");
    expect(useStudioStore.getState().pack.scenes).toHaveLength(4);
  });

  it("adds a layer to a scene", () => {
    useStudioStore
      .getState()
      .addSceneLayer("scene-exploration", { stemId: "stem-combat-base" });
    const scene = useStudioStore
      .getState()
      .pack.scenes.find((s) => s.id === "scene-exploration");
    expect(scene?.layers).toHaveLength(3);
  });

  it("updates a layer in a scene", () => {
    useStudioStore.getState().updateSceneLayer("scene-exploration", 0, {
      required: false,
    });
    const scene = useStudioStore
      .getState()
      .pack.scenes.find((s) => s.id === "scene-exploration");
    expect(scene?.layers[0].required).toBe(false);
  });

  it("removes a layer from a scene", () => {
    useStudioStore.getState().removeSceneLayer("scene-exploration", 1);
    const scene = useStudioStore
      .getState()
      .pack.scenes.find((s) => s.id === "scene-exploration");
    expect(scene?.layers).toHaveLength(1);
    expect(scene?.layers[0].stemId).toBe("stem-explore-base");
  });
});

describe("store — binding CRUD", () => {
  it("adds a binding", () => {
    const newBinding = {
      id: "test-binding",
      name: "Test Binding",
      sceneId: "scene-exploration",
      conditions: [{ field: "mode", op: "eq" as const, value: "test" }],
      priority: 50,
    };
    useStudioStore.getState().addBinding(newBinding);
    expect(useStudioStore.getState().pack.bindings).toHaveLength(6);
  });

  it("updates a binding", () => {
    useStudioStore.getState().updateBinding("bind-explore", { priority: 99 });
    const binding = useStudioStore
      .getState()
      .pack.bindings.find((b) => b.id === "bind-explore");
    expect(binding?.priority).toBe(99);
  });

  it("deletes a binding", () => {
    useStudioStore.getState().deleteBinding("bind-explore");
    expect(useStudioStore.getState().pack.bindings).toHaveLength(4);
  });

  it("adds a condition to a binding", () => {
    useStudioStore.getState().addBindingCondition("bind-explore", {
      field: "region",
      op: "eq",
      value: "forest",
    });
    const binding = useStudioStore
      .getState()
      .pack.bindings.find((b) => b.id === "bind-explore");
    expect(binding?.conditions).toHaveLength(2);
  });

  it("updates a condition", () => {
    useStudioStore.getState().updateBindingCondition("bind-explore", 0, {
      value: "stealth",
    });
    const binding = useStudioStore
      .getState()
      .pack.bindings.find((b) => b.id === "bind-explore");
    expect(binding?.conditions[0].value).toBe("stealth");
  });

  it("removes a condition", () => {
    // First add a second condition
    useStudioStore.getState().addBindingCondition("bind-explore", {
      field: "x",
      op: "gt",
      value: 5,
    });
    useStudioStore.getState().removeBindingCondition("bind-explore", 0);
    const binding = useStudioStore
      .getState()
      .pack.bindings.find((b) => b.id === "bind-explore");
    expect(binding?.conditions).toHaveLength(1);
    expect(binding?.conditions[0].field).toBe("x");
  });
});

describe("store — transition CRUD", () => {
  it("adds a transition", () => {
    const newTransition = {
      id: "test-trans",
      name: "Test",
      fromSceneId: "scene-exploration",
      toSceneId: "scene-combat",
      mode: "immediate" as const,
    };
    useStudioStore.getState().addTransition(newTransition);
    expect(useStudioStore.getState().pack.transitions).toHaveLength(5);
  });

  it("updates a transition", () => {
    useStudioStore
      .getState()
      .updateTransition("trans-explore-to-tension", { mode: "bar-sync" });
    const trans = useStudioStore
      .getState()
      .pack.transitions.find((t) => t.id === "trans-explore-to-tension");
    expect(trans?.mode).toBe("bar-sync");
  });

  it("deletes a transition", () => {
    useStudioStore
      .getState()
      .deleteTransition("trans-explore-to-tension");
    expect(useStudioStore.getState().pack.transitions).toHaveLength(3);
  });
});

describe("store — loadPack", () => {
  it("replaces the entire pack", () => {
    const minimalPack: SoundtrackPack = {
      meta: {
        id: "tiny",
        name: "Tiny",
        version: "1.0.0",
        schemaVersion: "1",
      },
      assets: [],
      stems: [],
      scenes: [],
      bindings: [],
      transitions: [],
    };
    useStudioStore.getState().loadPack(minimalPack);
    const state = useStudioStore.getState();
    expect(state.pack.meta.id).toBe("tiny");
    expect(state.section).toBe("project");
    expect(state.selectedId).toBeNull();
  });
});
