# Examples

Built-in example soundtrack packs, defined as TypeScript objects in the studio's seed data.

## Available packs

### Minimal Pack (`minimal-pack`)

The smallest valid soundtrack pack — one asset, one stem, one scene, one binding, zero transitions. Demonstrates the minimum viable data shape.

### Starter Adventure Pack (`starter-pack`)

A mid-complexity RPG pack with exploration, tension, combat, victory, and safe-zone scenes. Shows optional layers, fallback chains, priority binding resolution, and multiple transition modes.

### Combat Escalation Pack (`combat-escalation-pack`)

A multi-phase combat pack: patrol → skirmish → boss → victory. Features stinger-driven transitions, multi-condition bindings, boss choir overlays, and a BPM escalation curve (100 → 130 → 160).

## Loading in the studio

Use the **Example Pack** dropdown at the bottom of the studio sidebar to switch between packs. The studio reloads the full pack state on switch.

## Source

All example packs are defined in `apps/studio/src/app/seed-data.ts`.
