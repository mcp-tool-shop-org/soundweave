"use client";

import { useStudioStore } from "../store";
import type { Scene, SceneCategory } from "@soundweave/schema";

const SCENE_CATEGORIES: SceneCategory[] = [
  "exploration",
  "tension",
  "combat",
  "boss",
  "victory",
  "aftermath",
  "stealth",
  "safe-zone",
];

const START_MODES = ["immediate", "next-bar", "after-transition"] as const;

function newScene(n: number): Scene {
  return {
    id: `new-scene-${n}`,
    name: `New Scene ${n}`,
    category: "exploration",
    layers: [{ stemId: "" }],
  };
}

export function ScenesScreen() {
  const scenes = useStudioStore((s) => s.pack.scenes);
  const stems = useStudioStore((s) => s.pack.stems);
  const selectedId = useStudioStore((s) => s.selectedId);
  const setSelectedId = useStudioStore((s) => s.setSelectedId);
  const addScene = useStudioStore((s) => s.addScene);
  const updateScene = useStudioStore((s) => s.updateScene);
  const deleteScene = useStudioStore((s) => s.deleteScene);
  const addSceneLayer = useStudioStore((s) => s.addSceneLayer);
  const updateSceneLayer = useStudioStore((s) => s.updateSceneLayer);
  const removeSceneLayer = useStudioStore((s) => s.removeSceneLayer);

  const selected = scenes.find((s) => s.id === selectedId) ?? null;

  function handleAdd() {
    let n = scenes.length + 1;
    while (scenes.some((s) => s.id === `new-scene-${n}`)) n++;
    addScene(newScene(n));
  }

  return (
    <>
      <div className="screen-header">
        <h2>Scenes</h2>
        <p>Adaptive music scenes with layered stems</p>
      </div>
      <div className="screen-body">
        <div className="list-detail">
          {/* List */}
          <div className="entity-list">
            <div className="entity-list-header">
              <span>Scenes ({scenes.length})</span>
              <button className="btn btn-sm btn-primary" onClick={handleAdd}>
                + Add
              </button>
            </div>
            <div className="entity-list-items">
              {scenes.length === 0 && (
                <div className="empty-state">
                  <p>No scenes yet</p>
                  <button className="btn btn-primary" onClick={handleAdd}>
                    Add first scene
                  </button>
                </div>
              )}
              {scenes.map((s) => (
                <button
                  key={s.id}
                  className={`entity-list-item ${selectedId === s.id ? "selected" : ""}`}
                  onClick={() => setSelectedId(s.id)}
                >
                  <span>{s.name || s.id}</span>
                  <span className="badge badge-category">{s.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Detail */}
          <div className="detail-pane">
            {!selected ? (
              <div className="empty-state">
                <p>Select a scene to edit</p>
              </div>
            ) : (
              <>
                <h3>{selected.name || selected.id}</h3>

                {/* Missing fallback warning */}
                {selected.fallbackSceneId &&
                  !scenes.some(
                    (s) => s.id === selected.fallbackSceneId,
                  ) && (
                    <div className="inline-warning warning">
                      ⚠ Fallback scene &quot;{selected.fallbackSceneId}&quot;
                      not found
                    </div>
                  )}

                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label">ID</label>
                    <input
                      className="field-input"
                      value={selected.id}
                      onChange={(e) =>
                        updateScene(selected.id, { id: e.target.value })
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Name</label>
                    <input
                      className="field-input"
                      value={selected.name}
                      onChange={(e) =>
                        updateScene(selected.id, { name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label">Category</label>
                    <select
                      className="field-input"
                      value={selected.category}
                      onChange={(e) =>
                        updateScene(selected.id, {
                          category: e.target.value as SceneCategory,
                        })
                      }
                    >
                      {SCENE_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Fallback Scene</label>
                    <select
                      className="field-input"
                      value={selected.fallbackSceneId ?? ""}
                      onChange={(e) =>
                        updateScene(selected.id, {
                          fallbackSceneId: e.target.value || undefined,
                        })
                      }
                    >
                      <option value="">— none —</option>
                      {scenes
                        .filter((s) => s.id !== selected.id)
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name || s.id}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Tags (comma-separated)</label>
                  <input
                    className="field-input"
                    value={(selected.tags ?? []).join(", ")}
                    onChange={(e) =>
                      updateScene(selected.id, {
                        tags: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>

                {/* Layers */}
                <div className="sub-list">
                  <div className="sub-list-header">
                    <h4>Layers ({selected.layers.length})</h4>
                    <button
                      className="btn btn-sm"
                      onClick={() =>
                        addSceneLayer(selected.id, { stemId: "" })
                      }
                    >
                      + Add Layer
                    </button>
                  </div>
                  {selected.layers.length === 0 && (
                    <div className="inline-warning warning">
                      ⚠ Scene has no layers
                    </div>
                  )}
                  {selected.layers.map((layer, i) => {
                    const stemMissing =
                      layer.stemId !== "" &&
                      !stems.some((s) => s.id === layer.stemId);
                    return (
                      <div key={i} className="sub-list-item">
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <select
                              className="field-input"
                              style={{ flex: 1 }}
                              value={layer.stemId}
                              onChange={(e) =>
                                updateSceneLayer(selected.id, i, {
                                  stemId: e.target.value,
                                })
                              }
                            >
                              <option value="">— select stem —</option>
                              {stems.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name || s.id}
                                </option>
                              ))}
                            </select>
                            <select
                              className="field-input"
                              style={{ width: 130 }}
                              value={layer.startMode ?? "immediate"}
                              onChange={(e) =>
                                updateSceneLayer(selected.id, i, {
                                  startMode: e.target.value as typeof START_MODES[number],
                                })
                              }
                            >
                              {START_MODES.map((m) => (
                                <option key={m} value={m}>
                                  {m}
                                </option>
                              ))}
                            </select>
                            <label className="field-checkbox">
                              <input
                                type="checkbox"
                                checked={layer.required ?? false}
                                onChange={(e) =>
                                  updateSceneLayer(selected.id, i, {
                                    required: e.target.checked || undefined,
                                  })
                                }
                              />
                              Req
                            </label>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => removeSceneLayer(selected.id, i)}
                            >
                              ×
                            </button>
                          </div>
                          {stemMissing && (
                            <div
                              className="inline-warning warning"
                              style={{ margin: 0 }}
                            >
                              ⚠ Stem &quot;{layer.stemId}&quot; not found
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="btn-row">
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteScene(selected.id)}
                  >
                    Delete Scene
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
