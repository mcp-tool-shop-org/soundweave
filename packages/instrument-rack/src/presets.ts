// ────────────────────────────────────────────
// Factory presets — curated instrument palette for game scoring
// ────────────────────────────────────────────

import type { InstrumentPreset } from "@soundweave/schema";

/**
 * Built-in instrument presets.
 * Small but serious — these are designed to sound good together.
 */
export const FACTORY_PRESETS: InstrumentPreset[] = [
  // ── Drums ──
  {
    id: "drums-standard",
    name: "Standard Kit",
    category: "drums",
    params: {},
  },

  // ── Bass ──
  {
    id: "bass-sub",
    name: "Sub Bass",
    category: "bass",
    params: {
      oscillatorType: "sine",
      attack: 0.005,
      decay: 0.15,
      sustain: 0.8,
      release: 0.2,
      filterFreq: 400,
      filterQ: 2,
      filterType: "lowpass",
      gain: 0.8,
    },
  },
  {
    id: "bass-saw",
    name: "Saw Bass",
    category: "bass",
    params: {
      oscillatorType: "sawtooth",
      attack: 0.005,
      decay: 0.1,
      sustain: 0.7,
      release: 0.15,
      filterFreq: 800,
      filterQ: 3,
      filterType: "lowpass",
      gain: 0.6,
    },
  },
  {
    id: "bass-pulse",
    name: "Pulse Bass",
    category: "bass",
    params: {
      oscillatorType: "square",
      attack: 0.005,
      decay: 0.2,
      sustain: 0.5,
      release: 0.25,
      filterFreq: 600,
      filterQ: 2,
      filterType: "lowpass",
      gain: 0.55,
    },
  },

  // ── Pads ──
  {
    id: "pad-warm",
    name: "Warm Pad",
    category: "pad",
    params: {
      oscillatorType: "sawtooth",
      attack: 0.8,
      decay: 0.5,
      sustain: 0.7,
      release: 1.5,
      filterFreq: 1200,
      filterQ: 0.5,
      filterType: "lowpass",
      detune: 8,
      gain: 0.4,
    },
  },
  {
    id: "pad-dark",
    name: "Dark Pad",
    category: "pad",
    params: {
      oscillatorType: "sawtooth",
      attack: 1.2,
      decay: 0.8,
      sustain: 0.5,
      release: 2.0,
      filterFreq: 600,
      filterQ: 1,
      filterType: "lowpass",
      detune: 12,
      gain: 0.35,
    },
  },
  {
    id: "pad-glass",
    name: "Glass Pad",
    category: "pad",
    params: {
      oscillatorType: "sine",
      attack: 0.6,
      decay: 0.3,
      sustain: 0.8,
      release: 1.0,
      filterFreq: 4000,
      filterQ: 0.3,
      filterType: "lowpass",
      gain: 0.45,
    },
  },

  // ── Lead / Pluck ──
  {
    id: "lead-pluck",
    name: "Pluck Lead",
    category: "lead",
    params: {
      oscillatorType: "sawtooth",
      attack: 0.002,
      decay: 0.3,
      sustain: 0.1,
      release: 0.2,
      filterFreq: 3000,
      filterQ: 2,
      filterType: "lowpass",
      gain: 0.5,
    },
  },
  {
    id: "lead-bright",
    name: "Bright Lead",
    category: "lead",
    params: {
      oscillatorType: "sawtooth",
      attack: 0.01,
      decay: 0.15,
      sustain: 0.7,
      release: 0.3,
      filterFreq: 5000,
      filterQ: 1,
      filterType: "lowpass",
      gain: 0.5,
    },
  },
  {
    id: "lead-square",
    name: "Square Lead",
    category: "lead",
    params: {
      oscillatorType: "square",
      attack: 0.01,
      decay: 0.1,
      sustain: 0.6,
      release: 0.25,
      filterFreq: 2500,
      filterQ: 1.5,
      filterType: "lowpass",
      gain: 0.4,
    },
  },

  // ── Pulse / Arpeggio ──
  {
    id: "pulse-arp",
    name: "Arp Pulse",
    category: "pulse",
    params: {
      oscillatorType: "square",
      attack: 0.002,
      decay: 0.08,
      sustain: 0.3,
      release: 0.1,
      filterFreq: 2000,
      filterQ: 2,
      filterType: "lowpass",
      gain: 0.35,
    },
  },
  {
    id: "pulse-tick",
    name: "Tick Pulse",
    category: "pulse",
    params: {
      oscillatorType: "triangle",
      attack: 0.001,
      decay: 0.05,
      sustain: 0.15,
      release: 0.08,
      filterFreq: 4000,
      filterQ: 1,
      filterType: "lowpass",
      gain: 0.3,
    },
  },
];

/** Look up a preset by ID */
export function getPreset(id: string): InstrumentPreset | undefined {
  return FACTORY_PRESETS.find((p) => p.id === id);
}

/** Get all presets for a category */
export function getPresetsByCategory(category: string): InstrumentPreset[] {
  return FACTORY_PRESETS.filter((p) => p.category === category);
}
