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
  CuesScreen,
  MixerScreen,
  ExportScreen,
  SampleLabScreen,
  ScoreMapScreen,
  AutomationScreen,
  LibraryScreen,
} from "./screens";
import { starterPack } from "./seed-data";

function ScreenRouter() {
  const section = useStudioStore((s) => s.section);
  switch (section) {
    case "project":
    case "overview":
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
    case "cues":
      return <CuesScreen />;
    case "mixer":
      return <MixerScreen />;
    case "export":
      return <ExportScreen />;
    case "sample-lab":
      return <SampleLabScreen />;
    case "score-map":
      return <ScoreMapScreen />;
    case "automation":
      return <AutomationScreen />;
    case "library":
      return <LibraryScreen />;
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
