// ────────────────────────────────────────────
// Instrument Rack — resolves presets to voice instances
// ────────────────────────────────────────────

import type { InstrumentPreset } from "@soundweave/schema";
import type { InstrumentVoice, SynthParams } from "./types.js";
import { SynthVoice } from "./synth-voice.js";
import { DrumVoice } from "./drum-voice.js";
import { FACTORY_PRESETS } from "./presets.js";

/**
 * The instrument rack manages voice instances for each preset.
 * Given a preset ID, it returns the appropriate voice engine.
 */
export class InstrumentRack {
  private voices = new Map<string, InstrumentVoice>();
  private customPresets: InstrumentPreset[] = [];

  /** Register additional presets (e.g., from a pack) */
  registerPresets(presets: InstrumentPreset[]): void {
    this.customPresets = presets;
    // Clear cached voices so they get re-created with new presets
    this.voices.clear();
  }

  /** Get or create a voice for a preset ID */
  getVoice(presetId: string): InstrumentVoice | null {
    const cached = this.voices.get(presetId);
    if (cached) return cached;

    const preset =
      this.customPresets.find((p) => p.id === presetId) ??
      FACTORY_PRESETS.find((p) => p.id === presetId);

    if (!preset) return null;

    const voice = createVoiceForPreset(preset);
    this.voices.set(presetId, voice);
    return voice;
  }

  /** List all available preset IDs */
  listPresets(): InstrumentPreset[] {
    const byId = new Map<string, InstrumentPreset>();
    for (const p of FACTORY_PRESETS) byId.set(p.id, p);
    for (const p of this.customPresets) byId.set(p.id, p);
    return Array.from(byId.values());
  }

  /** Dispose all voices */
  dispose(): void {
    for (const voice of this.voices.values()) {
      voice.dispose();
    }
    this.voices.clear();
  }
}

function createVoiceForPreset(preset: InstrumentPreset): InstrumentVoice {
  if (preset.category === "drums") {
    return new DrumVoice();
  }

  // Extract synth params from preset
  const params: SynthParams = {};
  const p = preset.params;
  if (typeof p.oscillatorType === "string") params.oscillatorType = p.oscillatorType as OscillatorType;
  if (typeof p.attack === "number") params.attack = p.attack;
  if (typeof p.decay === "number") params.decay = p.decay;
  if (typeof p.sustain === "number") params.sustain = p.sustain;
  if (typeof p.release === "number") params.release = p.release;
  if (typeof p.filterFreq === "number") params.filterFreq = p.filterFreq;
  if (typeof p.filterQ === "number") params.filterQ = p.filterQ;
  if (typeof p.filterType === "string") params.filterType = p.filterType as BiquadFilterType;
  if (typeof p.detune === "number") params.detune = p.detune;
  if (typeof p.gain === "number") params.gain = p.gain;

  return new SynthVoice(preset.category, params);
}
