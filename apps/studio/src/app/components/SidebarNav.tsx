"use client";

import { useStudioStore, type Section } from "../store";
import { useReview } from "../hooks";

const navItems: { section: Section; label: string }[] = [
  { section: "project", label: "Project" },
  { section: "assets", label: "Assets" },
  { section: "stems", label: "Stems" },
  { section: "scenes", label: "Scenes" },
  { section: "bindings", label: "Bindings" },
  { section: "transitions", label: "Transitions" },
  { section: "review", label: "Review" },
  { section: "preview", label: "Preview" },
];

export function SidebarNav() {
  const section = useStudioStore((s) => s.section);
  const setSection = useStudioStore((s) => s.setSection);
  const { audit } = useReview();

  const totalWarnings = audit.errors.length + audit.warnings.length;

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
    </nav>
  );
}
