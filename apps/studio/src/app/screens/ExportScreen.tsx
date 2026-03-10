"use client";

import { useMemo, useState } from "react";
import { useStudioStore } from "../store";
import { useReview } from "../hooks";
import {
  exportRuntimePack,
  serializeRuntimePack,
  roundTripRuntimePack,
} from "@soundweave/runtime-pack";

type ExportStatus = "ready" | "warnings" | "blocked";

export function ExportScreen() {
  const pack = useStudioStore((s) => s.pack);
  const { summary, audit } = useReview();
  const [copied, setCopied] = useState(false);

  const status: ExportStatus = useMemo(() => {
    if (audit.errors.length > 0) return "blocked";
    if (audit.warnings.length > 0) return "warnings";
    return "ready";
  }, [audit]);

  const { serialized, roundTripOk } = useMemo(() => {
    try {
      const result = roundTripRuntimePack(pack);
      return { serialized: result.serialized, roundTripOk: true };
    } catch {
      // If export fails, try basic serialize for display
      try {
        const exported = exportRuntimePack(pack);
        return { serialized: serializeRuntimePack(exported), roundTripOk: false };
      } catch {
        return { serialized: "", roundTripOk: false };
      }
    }
  }, [pack]);

  const handleCopy = async () => {
    if (!serialized) return;
    await navigator.clipboard.writeText(serialized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!serialized) return;
    const blob = new Blob([serialized], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pack.meta.id || "soundtrack-pack"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusLabel =
    status === "ready"
      ? "Ready to export"
      : status === "warnings"
        ? `${audit.warnings.length} warning${audit.warnings.length !== 1 ? "s" : ""}`
        : `${audit.errors.length} error${audit.errors.length !== 1 ? "s" : ""} — fix before exporting`;

  return (
    <>
      <div className="screen-header">
        <h2>Export</h2>
        <p>Export your soundtrack pack as a runtime JSON file</p>
      </div>
      <div className="screen-body">
        {/* Readiness badge */}
        <div className="export-readiness">
          <div className={`export-status-badge ${status}`}>
            <span className="export-status-dot" />
            <span>{statusLabel}</span>
          </div>
          {roundTripOk && (
            <span className="export-roundtrip-ok">Round-trip verified</span>
          )}
        </div>

        {/* Runtime summary */}
        <div className="export-summary">
          <h3>Runtime Summary</h3>
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
          </div>
          {summary.categoriesPresent.length > 0 && (
            <div className="export-categories">
              {summary.categoriesPresent.map((cat) => (
                <span key={cat} className="badge badge-category">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Findings (if any) */}
        {status !== "ready" && (
          <div className="export-findings">
            <h3>
              {status === "blocked" ? "Errors (must fix)" : "Warnings"}
            </h3>
            <div className="export-findings-list">
              {(status === "blocked" ? audit.errors : audit.warnings).map(
                (f, i) => (
                  <div
                    key={i}
                    className={`finding-item ${status === "blocked" ? "error" : "warning"}`}
                  >
                    <span className="finding-code">{f.code}</span>
                    <span>{f.message}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="export-actions">
          <button
            className="btn btn-primary"
            onClick={handleCopy}
            disabled={status === "blocked" || !serialized}
          >
            {copied ? "Copied!" : "Copy JSON"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleDownload}
            disabled={status === "blocked" || !serialized}
          >
            Download .json
          </button>
        </div>

        {/* JSON preview */}
        {serialized && (
          <div className="export-preview">
            <h3>JSON Preview</h3>
            <pre className="export-json">{serialized}</pre>
          </div>
        )}
      </div>
    </>
  );
}
