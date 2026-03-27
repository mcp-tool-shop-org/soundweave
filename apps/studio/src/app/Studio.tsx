"use client";

import { useEffect } from "react";
import { useStudioStore } from "./store";
import { SidebarNav } from "./components/SidebarNav";
import {
  ArrangementScreen,
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
import { synthDemoPack } from "./seed-data";

function ScreenRouter() {
  const section = useStudioStore((s) => s.section);
  switch (section) {
    case "arrangement":
      return <ArrangementScreen />;
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
  const packId = useStudioStore((s) => s.pack.meta.id);

  useEffect(() => {
    // Only load default pack if store is uninitialized (still has the empty "new-pack")
    if (packId === "new-pack") {
      loadPack(synthDemoPack);
    }
  }, [loadPack, packId]);

  return (
    <div className="app-shell">
      <SidebarNav />
      <main className="main-content">
        <ScreenRouter />
      </main>
    </div>
  );
}
