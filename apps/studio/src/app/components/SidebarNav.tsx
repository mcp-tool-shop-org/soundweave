"use client";

import { useStudioStore, type Section } from "../store";
import { useReview } from "../hooks";
import { examplePacks } from "../seed-data";

const navItems: { section: Section; label: string }[] = [
  { section: "project", label: "Project" },
  { section: "assets", label: "Assets" },
  { section: "stems", label: "Stems" },
  { section: "scenes", label: "Scenes" },
  { section: "clips", label: "Clips" },
  { section: "bindings", label: "Bindings" },
  { section: "transitions", label: "Transitions" },
  { section: "review", label: "Review" },
  { section: "preview", label: "Preview" },
  { section: "performance", label: "Performance" },
  { section: "cues", label: "Cues" },
  { section: "mixer", label: "Mixer" },
  { section: "export", label: "Export" },
];

export function SidebarNav() {
  const section = useStudioStore((s) => s.section);
  const setSection = useStudioStore((s) => s.setSection);
  const pack = useStudioStore((s) => s.pack);
  const loadPack = useStudioStore((s) => s.loadPack);
  const { audit } = useReview();

  const totalWarnings = audit.errors.length + audit.warnings.length;

  const handlePackSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = examplePacks.find((p) => p.id === e.target.value);
    if (selected) loadPack(selected.pack);
  };

  return (
    <nav className="nav-rail">
      <div className="nav-brand">⚡ Soundweave</div>
      <div className="nav-items">
        {navItems.map((item) => (
          <button
            key={item.section}
            className={`nav-item ${section === item.section ? "active" : ""}`}
            onClick={() => setSection(item.section)}
          >
            {item.label}
            {item.section === "review" && totalWarnings > 0 && (
              <span
                className={`nav-badge ${audit.errors.length > 0 ? "error" : ""}`}
              >
                {totalWarnings}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="nav-pack-switcher">
        <label className="nav-pack-label">Example Pack</label>
        <select
          className="nav-pack-select"
          value={pack.meta.id}
          onChange={handlePackSwitch}
        >
          {examplePacks.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}
