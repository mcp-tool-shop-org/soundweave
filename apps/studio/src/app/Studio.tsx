"use client";

import { useEffect } from "react";
import { useStudioStore } from "./store";
import { SidebarNav } from "./components/SidebarNav";
import {
  ProjectScreen,
  AssetsScreen,
  StemsScreen,
  ScenesScreen,
  ClipsScreen,
  BindingsScreen,
  TransitionsScreen,
  ReviewScreen,
  PreviewScreen,
  PerformanceScreen,
  ExportScreen,
} from "./screens";
import { starterPack } from "./seed-data";

function ScreenRouter() {
  const section = useStudioStore((s) => s.section);
  switch (section) {
    case "project":
      return <ProjectScreen />;
    case "assets":
      return <AssetsScreen />;
    case "stems":
      return <StemsScreen />;
    case "scenes":
      return <ScenesScreen />;
    case "clips":
      return <ClipsScreen />;
    case "bindings":
      return <BindingsScreen />;
    case "transitions":
      return <TransitionsScreen />;
    case "review":
      return <ReviewScreen />;
    case "preview":
      return <PreviewScreen />;
    case "performance":
      return <PerformanceScreen />;
    case "export":
      return <ExportScreen />;
  }
}

export default function Studio() {
  const loadPack = useStudioStore((s) => s.loadPack);

  useEffect(() => {
    loadPack(starterPack);
  }, [loadPack]);

  return (
    <div className="app-shell">
      <SidebarNav />
      <main className="main-content">
        <ScreenRouter />
      </main>
    </div>
  );
}
