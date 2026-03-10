# @soundweave/audio-engine

Sample playback and voice management for Soundweave.

## What It Owns

- Trimmed region playback
- Slice playback
- Kit slot playback
- Sample instrument note playback (with pitch shifting)
- Voice lifecycle management

## Key Exports

```ts
import {
  playTrimmedRegion,
  playSlice,
  playKitSlot,
  playSampleInstrumentNote,
} from "@soundweave/audio-engine";
```

- `playTrimmedRegion` — play an audio buffer within trim boundaries
- `playSlice` — play a specific sample slice
- `playKitSlot` — play a kit slot at a given pitch
- `playSampleInstrumentNote` — play a pitched note on a sample instrument

## What It Does Not Own

- Scene orchestration and mixing (handled by Studio)
- Audio file decoding (browser AudioContext handles this)
- Clip/cue composition (handled by `@soundweave/schema` types)

## Dependencies

- `@soundweave/schema` — types for assets, slices, kits, instruments
