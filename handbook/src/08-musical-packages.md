# Musical and Playback Packages

These packages handle composition, playback, and the creative engine of Soundweave.

## `@soundweave/music-theory`

Zero-dependency foundation for musical primitives.

- **Pitch** — pitch classes, octaves, MIDI note numbers, note names
- **Scales** — 12+ scale definitions, pitch class generation, `isInScale`, `snapToScale`, diatonic transposition
- **Chords** — chord pitches, diatonic chords, chord palettes, pad voicing, bass lines, arpeggiation, progressions
- **Motifs** — transpose, invert, reverse, octave shift, rhythm scale, snap-to-scale
- **Intensity** — low/mid/high derivation, tension, brighten

## `@soundweave/clip-engine`

Clip sequencing, composition transforms, and cue scheduling.

- **Playback** — `ClipPlayer` and `SceneClipPlayer` for note-level scheduling
- **Transforms** — transpose, invert, reverse, octave shift, rhythm scale, snap-to-scale
- **Variations** — rhythmic, melodic, thin, densify, accents, ghost hits
- **Intensity** — derive intensity variants, tension, brighten, pad voicing, bass line, arpeggiate
- **Chords** — diatonic chords, chord palette, progressions
- **Cue scheduling** — `resolveCuePlan`, section resolution, tick/bar/beat conversion

Dependencies: `schema`, `instrument-rack`, `music-theory`

## `@soundweave/instrument-rack`

Voice and instrument management.

- **Synth voices** — oscillator-based with envelope and filter
- **Drum voices** — sample-based percussion
- **Instrument rack** — multi-voice management, routing, disposal
- **Factory presets** — categorized built-in presets (`bass-sub`, `drums-standard`, etc.)
- **Utilities** — MIDI-to-frequency, pitch-to-drum mapping

Dependencies: `schema`

## `@soundweave/audio-engine`

Low-level sample playback and voice lifecycle.

- `playTrimmedRegion` — trimmed buffer playback
- `playSlice` — sample slice playback
- `playKitSlot` — kit slot at pitch
- `playSampleInstrumentNote` — pitched instrument note with ADSR and filter

Dependencies: `schema`

## `@soundweave/playback-engine`

The real-time audio system.

- **Transport** — play, pause, stop, seek, timing
- **AssetLoader** — fetch and decode audio assets
- **ScenePlayer** — scene playback with layered stems
- **TransitionPlayer** — crossfade, stinger-then-switch, bar-sync transitions
- **SequencePlayer** — ordered scene chains
- **Mixer** — per-stem gain, pan, mute, solo, bus routing
- **Effects** — EQ, delay, reverb, compressor with create/dispose lifecycle
- **CueRenderer** — offline rendering to audio buffer
- **CuePlayer** — cue-level playback coordination
- **WAV encoding** — `encodeWav` for export

Dependencies: `schema`, `audio-engine`, `scene-mapper`

## `@soundweave/sample-lab`

Sample workflow helpers for the import-to-instrument pipeline.

- **Trim** — resolve/apply trim regions and loop points
- **Slice** — even slicing and onset-based slicing
- **Kit** — create kits, add/remove slots, auto-map slices to MIDI
- **Instrument** — sample instruments with pitch shifting and range checking
- **Import** — infer source type from filename, build imported assets

Dependencies: `schema`

## `@soundweave/score-map`

World scoring logic.

- **Motif families** — variants, scene links, entity references
- **Score profiles** — tempo/intensity ranges, palette tags, key/scale
- **Cue families** — group scenes by role, link motifs, shared analysis
- **Score map entries** — map game contexts to profiles and families
- **Derivation** — records, transforms, chains, graph traversal

Dependencies: `schema`

## `@soundweave/automation`

Expressive automation system.

- **Lanes** — create, add/remove/update points, target management
- **Interpolation** — linear interpolation, regular sampling, multi-lane evaluation
- **Macros** — intensity/tension/energy state, macro-to-parameter mappings
- **Envelopes** — section-scoped automation (entry, sustain, exit)
- **Capture** — live recording, thinning, lane application, merge

Dependencies: `schema`

## `@soundweave/library`

Creative recall and reuse.

- **Templates** — create, instantiate, filter, search, tag
- **Snapshots** — freeze/restore entity state, query, counts
- **Branches** — branch from snapshot, instantiate, trace lineage, descendants
- **Favorites** — bookmark entities, filter by kind
- **Collections** — CRUD, membership, resolution, search
- **Compare** — field-by-field diff, structural equality, diff count, promote version

Dependencies: `schema`

## `@soundweave/scene-mapper`

Trigger mapping and deterministic scene resolution.

- Evaluate trigger conditions (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `includes`)
- Priority-based binding resolution with tie-breaking
- Detailed resolution results (matched, rejected, warnings)

Dependencies: `schema`

## `@soundweave/runtime-pack`

Export and import for game engine consumption.

- Strip authoring-only metadata (names, notes, editor state)
- Re-validate during export
- Round-trip verification

Dependencies: `schema`
