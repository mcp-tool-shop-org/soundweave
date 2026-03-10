<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/soundweave/readme.png" width="200" alt="SoundWeave">
</p>

# @soundweave/instrument-rack

Voice and instrument management for Soundweave — synths, drums, and factory presets.

## What It Owns

- Synth voice creation and parameter management
- Drum voice creation with per-piece configuration
- Instrument rack lifecycle (create, connect, dispose)
- Factory preset library with categorized access
- MIDI-to-frequency conversion and pitch-to-drum mapping

## Key Exports

```ts
import {
  InstrumentRack,
  SynthVoice,
  DrumVoice,
  FACTORY_PRESETS,
  getPreset,
  getPresetsByCategory,
  midiToFreq,
  pitchToDrum,
} from "@soundweave/instrument-rack";
```

- `InstrumentRack` — manages multiple voices, routing, and disposal
- `SynthVoice` — oscillator-based voice with envelope and filter
- `DrumVoice` — sample-based percussion voice
- `FACTORY_PRESETS` — built-in preset collection
- `getPreset(name)` / `getPresetsByCategory(cat)` — preset lookup

## Dependencies

- `@soundweave/schema` — types for instruments, presets, voices
