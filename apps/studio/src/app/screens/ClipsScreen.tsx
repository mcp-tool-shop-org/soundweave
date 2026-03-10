"use client";

import { useStudioStore } from "../store";
import type { Clip, ClipLane } from "@soundweave/schema";
import { FACTORY_PRESETS } from "@soundweave/instrument-rack";
import { NoteGrid } from "../components/NoteGrid";

const CLIP_LANES: ClipLane[] = ["drums", "bass", "harmony", "motif", "accent"];
const EMPTY_CLIPS: never[] = [];
const EMPTY_VARIANTS: never[] = [];

function newClip(n: number): Clip {
  return {
    id: `clip-${n}`,
    name: `New Clip ${n}`,
    lane: "motif",
    instrumentId: "lead-pluck",
    bpm: 120,
    lengthBeats: 4,
    notes: [],
    loop: true,
  };
}

export function ClipsScreen() {
  const clips = useStudioStore((s) => s.pack.clips ?? EMPTY_CLIPS);
  const selectedId = useStudioStore((s) => s.selectedId);
  const setSelectedId = useStudioStore((s) => s.setSelectedId);
  const addClip = useStudioStore((s) => s.addClip);
  const updateClip = useStudioStore((s) => s.updateClip);
  const deleteClip = useStudioStore((s) => s.deleteClip);
  const addClipNote = useStudioStore((s) => s.addClipNote);
  const removeClipNote = useStudioStore((s) => s.removeClipNote);
  const removeClipVariant = useStudioStore((s) => s.removeClipVariant);
  const duplicateClipAsVariant = useStudioStore((s) => s.duplicateClipAsVariant);

  const selected = clips.find((c) => c.id === selectedId) ?? null;

  function handleAdd() {
    let n = clips.length + 1;
    while (clips.some((c) => c.id === `clip-${n}`)) n++;
    addClip(newClip(n));
  }

  return (
    <>
      <div className="screen-header">
        <h2>Clips</h2>
        <p>Compose musical patterns with the built-in instrument rack</p>
      </div>
      <div className="screen-body">
        <div className="list-detail">
          {/* List */}
          <div className="entity-list">
            <div className="entity-list-header">
              <span>Clips ({clips.length})</span>
              <button className="btn btn-sm btn-primary" onClick={handleAdd}>
                + Add
              </button>
            </div>
            <div className="entity-list-items">
              {clips.length === 0 && (
                <div className="empty-state">
                  <p>No clips yet</p>
                  <button className="btn btn-primary" onClick={handleAdd}>
                    Add first clip
                  </button>
                </div>
              )}
              {clips.map((c) => (
                <button
                  key={c.id}
                  className={`entity-list-item ${selectedId === c.id ? "selected" : ""}`}
                  onClick={() => setSelectedId(c.id)}
                >
                  <span>{c.name || c.id}</span>
                  <span className="badge badge-category">{c.lane}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Detail */}
          <div className="detail-pane">
            {!selected ? (
              <div className="empty-state">
                <p>Select a clip to edit</p>
              </div>
            ) : (
              <>
                <h3>{selected.name || selected.id}</h3>

                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label">ID</label>
                    <input
                      className="field-input"
                      value={selected.id}
                      onChange={(e) =>
                        updateClip(selected.id, { id: e.target.value })
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Name</label>
                    <input
                      className="field-input"
                      value={selected.name}
                      onChange={(e) =>
                        updateClip(selected.id, { name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label">Lane</label>
                    <select
                      className="field-input"
                      value={selected.lane}
                      onChange={(e) =>
                        updateClip(selected.id, {
                          lane: e.target.value as ClipLane,
                        })
                      }
                    >
                      {CLIP_LANES.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Instrument</label>
                    <select
                      className="field-input"
                      value={selected.instrumentId}
                      onChange={(e) =>
                        updateClip(selected.id, {
                          instrumentId: e.target.value,
                        })
                      }
                    >
                      {FACTORY_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label">BPM</label>
                    <input
                      className="field-input"
                      type="number"
                      min={40}
                      max={300}
                      value={selected.bpm}
                      onChange={(e) =>
                        updateClip(selected.id, {
                          bpm: Number(e.target.value) || 120,
                        })
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Length (beats)</label>
                    <input
                      className="field-input"
                      type="number"
                      min={1}
                      max={64}
                      value={selected.lengthBeats}
                      onChange={(e) =>
                        updateClip(selected.id, {
                          lengthBeats: Number(e.target.value) || 4,
                        })
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Quantize</label>
                    <select
                      className="field-input"
                      value={selected.quantize ?? 120}
                      onChange={(e) =>
                        updateClip(selected.id, {
                          quantize: Number(e.target.value),
                        })
                      }
                    >
                      <option value={480}>Quarter</option>
                      <option value={240}>8th</option>
                      <option value={120}>16th</option>
                    </select>
                  </div>
                </div>

                <div className="field-row">
                  <label className="field-checkbox">
                    <input
                      type="checkbox"
                      checked={selected.loop}
                      onChange={(e) =>
                        updateClip(selected.id, { loop: e.target.checked })
                      }
                    />
                    Loop
                  </label>
                </div>

                {/* Note grid editor */}
                <div className="sub-list">
                  <div className="sub-list-header">
                    <h4>Notes ({selected.notes.length})</h4>
                  </div>
                  <NoteGrid
                    clip={selected}
                    onAddNote={(note) => addClipNote(selected.id, note)}
                    onRemoveNote={(index) => removeClipNote(selected.id, index)}
                  />
                </div>

                {/* Variants */}
                <div className="sub-list">
                  <div className="sub-list-header">
                    <h4>Variants ({(selected.variants ?? EMPTY_VARIANTS).length})</h4>
                    <button
                      className="btn btn-sm"
                      onClick={() =>
                        duplicateClipAsVariant(
                          selected.id,
                          `Variant ${(selected.variants ?? []).length + 1}`,
                        )
                      }
                    >
                      + Duplicate as Variant
                    </button>
                  </div>
                  {(selected.variants ?? EMPTY_VARIANTS).length === 0 && (
                    <div className="empty-state" style={{ padding: "8px 0" }}>
                      <p style={{ fontSize: 13 }}>
                        No variants — duplicate the clip to create A/B patterns
                      </p>
                    </div>
                  )}
                  {(selected.variants ?? EMPTY_VARIANTS).map((v) => (
                    <div key={v.id} className="sub-list-item">
                      <div style={{ flex: 1, display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ flex: 1 }}>
                          {v.name} ({v.notes.length} notes)
                        </span>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => removeClipVariant(selected.id, v.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="field-group" style={{ marginTop: 12 }}>
                  <label className="field-label">Tags (comma-separated)</label>
                  <input
                    className="field-input"
                    value={(selected.tags ?? []).join(", ")}
                    onChange={(e) =>
                      updateClip(selected.id, {
                        tags: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>

                <div className="btn-row">
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteClip(selected.id)}
                  >
                    Delete Clip
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
