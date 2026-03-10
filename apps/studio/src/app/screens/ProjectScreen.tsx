"use client";

import { useStudioStore } from "../store";
import { useReview } from "../hooks";

export function ProjectScreen() {
  const pack = useStudioStore((s) => s.pack);
  const updateMeta = useStudioStore((s) => s.updateMeta);
  const { summary, audit } = useReview();

  return (
    <>
      <div className="screen-header">
        <h2>Project</h2>
        <p>Pack metadata, stats, and health overview</p>
      </div>
      <div className="screen-body">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{summary.counts.assets}</div>
            <div className="stat-label">Assets</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.counts.stems}</div>
            <div className="stat-label">Stems</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.counts.scenes}</div>
            <div className="stat-label">Scenes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.counts.bindings}</div>
            <div className="stat-label">Bindings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.counts.transitions}</div>
            <div className="stat-label">Transitions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{audit.errors.length}</div>
            <div className="stat-label">Errors</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{audit.warnings.length}</div>
            <div className="stat-label">Warnings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{audit.notes.length}</div>
            <div className="stat-label">Notes</div>
          </div>
        </div>

        {/* Metadata editing */}
        <div className="meta-section">
          <h3>Pack Metadata</h3>
          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Name</label>
              <input
                className="field-input"
                value={pack.meta.name}
                onChange={(e) => updateMeta({ name: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label className="field-label">Version</label>
              <input
                className="field-input"
                value={pack.meta.version}
                onChange={(e) => updateMeta({ version: e.target.value })}
              />
            </div>
          </div>
          <div className="field-row">
            <div className="field-group">
              <label className="field-label">ID</label>
              <input
                className="field-input"
                value={pack.meta.id}
                onChange={(e) => updateMeta({ id: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label className="field-label">Author</label>
              <input
                className="field-input"
                value={pack.meta.author ?? ""}
                onChange={(e) => updateMeta({ author: e.target.value || undefined })}
              />
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Description</label>
            <textarea
              className="field-input"
              value={pack.meta.description ?? ""}
              onChange={(e) =>
                updateMeta({ description: e.target.value || undefined })
              }
            />
          </div>
          <div className="field-group">
            <label className="field-label">Tags (comma-separated)</label>
            <input
              className="field-input"
              value={(pack.meta.tags ?? []).join(", ")}
              onChange={(e) =>
                updateMeta({
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Schema Version</label>
              <input
                className="field-input"
                value={pack.meta.schemaVersion}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Categories present */}
        <div className="meta-section">
          <h3>Categories Present</h3>
          {summary.categoriesPresent.length === 0 ? (
            <p style={{ color: "var(--text-dim)", fontSize: 13 }}>None</p>
          ) : (
            <div className="category-list">
              {summary.categoriesPresent.map((cat) => (
                <span key={cat} className="badge badge-category">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Unused entities */}
        <div className="meta-section">
          <h3>Unused Entities</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{summary.unused.assets}</div>
              <div className="stat-label">Unused Assets</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{summary.unused.stems}</div>
              <div className="stat-label">Unused Stems</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{summary.unused.scenes}</div>
              <div className="stat-label">Unreferenced Scenes</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
